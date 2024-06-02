"use client";
import toast from "react-hot-toast";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import {
  SkyWayContext,
  SkyWayRoom,
  LocalSFURoomMember,
  SkyWayStreamFactory,
  SfuRoom, //ほとんどがtsの型指定のアリバイ用
  RoomPublication,
  LocalStream,
  RemoteRoomMember,
  RemoteVideoStream,
  RemoteAudioStream,
  MemberJoinedEvent,
  MemberLeftEvent,
} from "@skyway-sdk/room";
import { faker } from '@faker-js/faker/locale/ja';
import { useRecoilState } from "recoil";
import {
  skywayTokenState,
  myChannelNameState,
  skywayJwtForTokenState,
} from "@/lib/context";
import { JA_CHANNEL_MAPPINGS } from "@/lib/constant";
import MyVideo from "./myVideo";
import { validSkywayToken } from "@/lib/controlSkyway";
import ControlCardList from "./Card";
// import BasicSetup from "./DraggableCard";
// import ControlDCardList from "./DraggableCard";

type MemberInfo = { memberId: string; memberName: string };

import Image from "next/image";

export default function DynamicComponentRoom() {
  const [skywayToken, setSkywayToken] = useRecoilState(skywayTokenState);
  const [skywayJwtForToken, setSkywayJwtForToken] = useRecoilState(
    skywayJwtForTokenState
  );
  const [myChannelName] = useRecoilState(myChannelNameState);
  const [memberList, setMemberList] = useState<MemberInfo[]>([]);
  const [isChannelJoined, setIsChannelJoined] = useState(false);
  const [isChannelInitializing, setIsChannelInitializing] = useState(false);
  const [myName, setMyName] = useState("");
  const [myId, setMyId] = useState("");
  const myVideoRef = useRef<HTMLCanvasElement>(null);
  const memberListRef = useRef<HTMLDivElement>(null);
  let room: SfuRoom;
  let member: LocalSFURoomMember;

  const [isNavigationAllowed, setIsNavigationAllowed] = useState(false);

  useLayoutEffect(() => {
    setMyName(faker.person.lastName());
    if (!validSkywayToken(skywayJwtForToken)) {
      setSkywayToken("");
      setSkywayJwtForToken("");
      location.href = "/";
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isNavigationAllowed) {
        const message = '本当にページを離れますか？';
        event.returnValue = message;  // これが確認ダイアログに表示されます。
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isNavigationAllowed]); // 依存配列に `isNavigationAllowed` を追加

  // ナビゲーションを許可するためのボタンのハンドラ
  const allowNavigation = () => {
    setIsNavigationAllowed(true);
  };

  useEffect(() => {
    // 履歴エントリを追加して、ページロード時の位置に固定する
    window.history.pushState(null, document.title, window.location.href);

    const handlePopState = (event: PopStateEvent): void => {
      // 再度、現在の位置で履歴エントリを追加し、バックナビゲーションを防ぐ
      window.history.pushState(null, document.title, window.location.href);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const subscribeAndAttach = async (publication: RoomPublication<LocalStream>) => {
    if (!room) {
      return;
    }
    if (publication.publisher.id === member.id) {
      setMyId(member.id);
      return;
    }
    const { stream } = await member.subscribe<RemoteVideoStream | RemoteAudioStream>(publication.id);
    let mediaElement;
    const memberDiv = memberListRef.current
      ?.getElementsByClassName(`member-${publication.publisher.id}`)
      .item(0) as HTMLDivElement;
    switch (stream.contentType) {
      case "video":
        mediaElement = memberDiv
          .getElementsByTagName("video")
          .item(0) as HTMLVideoElement;
        break;
      case "audio":
        mediaElement = memberDiv
          .getElementsByTagName("audio")
          .item(0) as HTMLAudioElement;
        break;
      default:
        return;
    }
    stream.attach(mediaElement);
  }

  const testShowInfo = () => {
    console.log("Checking info from Skyway SDK----------------------------");
    console.log(room);
    console.log(room.members);
    console.log("----------------------------");
  }

  const startMemberListControl = () => {
    //単なる通知だけでなく，memberDivにも関係している
    if (!room) {
      return;
    }

    room.members.forEach((remoteMember: RemoteRoomMember) => {
      if (remoteMember.id == member.id) {
        return;
      }
      setMemberList((prev) => [
        ...prev,
        { memberId: remoteMember.id, memberName: remoteMember.metadata || "" },
      ]);
    });

    room.onMemberJoined.add(async (event: MemberJoinedEvent) => {
      setMemberList((prev) => [
        ...prev,
        { memberId: event.member.id, memberName: event.member.metadata || "" },
      ]);
      toast(`${event.member.metadata}さんが参加しました`, { icon: "👏" });
      console.log(member.id);
    });

    room.onMemberLeft.add(async (event: MemberLeftEvent) => {
      setMemberList((prev) =>
        prev.filter((member) => member.memberId !== event.member.id)
      );
      toast(`${event.member.metadata}さんが退出しました`, { icon: "💨" });
    });
  }

  const publishVideoAndAudioStream = async () => {
    const { audio, video } = await SkyWayStreamFactory.createMicrophoneAudioAndCameraStream({
      video: { height: 200, width: 300, frameRate: 15 },
    });
    await member.publish(video, {
      encodings: [
        // 複数のパラメータをセットする
        { maxBitrate: 400_000, scaleResolutionDownBy: 2 },
        { maxBitrate: 680_000, scaleResolutionDownBy: 1 },
      ],
    });
    await member.publish(audio);
  }

  const joinChannel = async () => {
    if (!Object.keys(JA_CHANNEL_MAPPINGS).includes(myChannelName)) {
      return toast.error("不正チャンネル名です");
    }
    if (!skywayToken) {
      return toast.error("skywayを利用するTokenがありません");
    }
    if (isChannelInitializing) {
      return toast.error("現在チャンネル初期化中です\nこのままお待ち下さい");
    }

    setIsChannelInitializing(() => true);

    try {
      //任意のRoomの取得を試みて，なければ作成
      const context = await SkyWayContext.Create(skywayToken);
      //roomはconstではないです！！！！！
      room = await SkyWayRoom.FindOrCreate(context, {
        type: "sfu",
        name: JA_CHANNEL_MAPPINGS[myChannelName],
      });
      // MemberのRoomへの参加
      member = await room.join({
        metadata: myName,
      });
      setIsChannelJoined(() => true);

      testShowInfo();

      startMemberListControl();
      await publishVideoAndAudioStream();
      room.publications.forEach(subscribeAndAttach);
      room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
      toast.success(
        `接続成功`
      );
      // console.log(member.id);
    } catch (e) {
      console.error(e);
      initializeToken("チャンネル初期化時にエラーが発生しました。\n5秒後に内部トークンを初期化してトップページへ遷移します。");
    }
    setIsChannelInitializing(() => false);
  };

  function initializeToken(message: string) {
    toast.error(
      message
    );
    setTimeout(() => {
      setSkywayToken("");
      setSkywayJwtForToken("");
      location.href = "/";
    }, 5000);
  }

  const randomDealCard = async () => {
    console.log("Checking info from Skyway SDK----------------------------");

    // console.log(room); //無理．joinChannel内の関数でしかroomは取得できない

    console.log("----------------------------");

    // console.log(memberList);
    // const data = {
    //   myChannelName: myChannelName,
    //   myName: myName,
    //   myId: myId,
    //   memberList: memberList,
    // };

    // const response = await fetch("/api/getCardInfo", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(data),
    // });

    // const apiResponse = await response.json();

    // if (response.ok) {
    //   if (apiResponse.isSuccess) {
    //     const apiResponseBody = apiResponse.body;
    //     console.log(apiResponseBody);
    //   } else {
    //     const apiResponseBody = apiResponse.body;
    //     toast.error(apiResponseBody.errorMessage);
    //   }
    // } else {
    //   toast.error("connectionError");
    //   console.error(response)
    // }

  };

  return (
    <>
      <div>
        <div
          ref={memberListRef}
          className="grid grid-cols-5 md:grid-cols-5 border bg-black border-black"
        >
          <div className="border-2 border-gray-800">
            <p className="text-center py-2 text-lx font-bold text-white">あなた({myName})</p>
            <MyVideo ref={myVideoRef} myName={myName} />
          </div>
          {memberList &&
            memberList.map((member) => {
              return (
                <div
                  key={member.memberId}
                  className={`border-2 border-gray-800 member-${member.memberId}`}
                >
                  <p className="text-center py-2 text-lx font-bold text-white">{member.memberName}</p>
                  <video autoPlay playsInline muted src="" className="w-full aspect-w-16 aspect-h-9" />
                  <audio autoPlay src="" />
                </div>
              );
            })}
        </div>
        <div className="flex flex-col text-center w-full mb-1">
          {(true || isChannelJoined) && (
            (true || memberList.length) ? ( //デバッグ用にtrueを入れている
              // isChannelJoinedがtrueで、かつmemberListにメンバーが存在する場合のコンテンツ
              <div>
                <div>
                  <ControlCardList />
                  {/* <ControlDCardList /> */}
                  <h1 className="text-2xl font-medium title-font text-gray-900">
                    参加チャンネル：{myChannelName}
                  </h1>
                  <>
                    <p className="text-gray-700 opacity-60">部屋退出は「トップページに戻る」ボタンから</p>
                  </>
                </div>
              </div>
            ) : (
              // isChannelJoinedがtrueで、かつmemberListにメンバーが存在しない場合のコンテンツ
              <div className="flex flex-wrap flex-columns justify-center mt-2">
                <div className="bg-gray-100 rounded flex p-4 h-full items-center">
                  <div className="animate-spin h-10 w-10 mr-2 border-4 border-blue-700 rounded-full border-t-transparent"></div>
                  <span className="title-font font-medium">
                    他の人が参加するのを待っています...
                  </span>
                </div>
              </div>
            )
          )}
        </div>
        {!isChannelJoined && (
          <div className="p-2">
            <button
              onClick={joinChannel}
              className="flex mx-auto bg-green-500 border-0 px-8 focus:outline-none hover:bg-green-600 rounded disabled:bg-gray-600"
            >
              {(true) ? (
                <p className="text-white text-lg p-2">
                  チャンネルに参加する
                  <span className="block mt-1 text-sm pl-1 pb-2 text-white/80">
                    ※映像&音声の送受信開始
                  </span>
                </p>
              ) :
                <span className="text-white text-lg p-2 inline-block align-middle">
                  カメラと音声が有効になるとチャンネル参加できます
                </span>
              }
            </button>
          </div>
        )}
      </div>

      <div>
        <section className="fixed right-0 bottom-0 flex m-2">
          <a href="/" onClick={allowNavigation}>
            <div className="text-4lx bg-red-600 rounded-lg p-4 mb-2 text-center hover:bg-red-700 cursor-pointer text-white font-bold mr-2">
              トップページに戻る
            </div>
          </a>
          <button
            onClick={() => {
              initializeToken("5秒後にトークンを初期化します.");
              allowNavigation();
            }}
            className="text-4lx bg-red-600 rounded-lg p-4 mb-2 text-center hover:bg-red-700 cursor-pointer text-white font-bold mr-2"
          >
            トークンを初期化
          </button>
          
          <button
            onClick={randomDealCard}
            className="text-4lx bg-red-600 rounded-lg p-4 mb-2 text-center hover:bg-red-700 cursor-pointer text-white font-bold mr-2"
          >
            ランダム配布
          </button>
        </section>
      </div>

    </>
  );
}