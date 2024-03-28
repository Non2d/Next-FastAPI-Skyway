// middleware.ts (または特定のパスに対応するmiddlewareファイル)
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const memberList = await req.json();

  // console.log("これです！"+JSON.stringify(memberList, null, 2));

  // await new Promise(resolve => setTimeout(resolve, 9500));
  console.log(process.env.BASIC_AUTH_USER);


  const dstMembers = memberList["memberList"]; //送付先の候補

  // 配列からランダムに一つの識別子を選択
  const randomIndex: number = Math.floor(Math.random() * dstMembers.length);
  const dstMember: string = dstMembers[randomIndex]; //送付先

  let responseJson = {
    isSuccess: true,
    body: {
      dstMember: dstMember
    }
  };

  return NextResponse.json(responseJson);
}