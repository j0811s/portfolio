import { NextResponse } from 'next/server';

export function GET() {
  const data = {
    career: [
      {
        year: 2016,
        details: [
          {
            month: 3,
            text: [
              "某ホームセンターのペット部門で販売業務を担当する。"
            ]
          }
        ]
      },
      {
        year: 2018,
        details: [
          {
            month: 3,
            text: [
              "退職後、HTML, CSS, jQueryを独学しながら転職活動を行う。"
            ]
          }
        ]
      },
      {
        year: 2019,
        details: [
          {
            month: 1,
            text: [
              "2社目に入社",
              "某アパレルブランド ECサイトの運用保守（CMS）",
              "某アパレルブランド 独自のテンプレートエンジンを利用したLP制作"
            ]
          },
          {
            month: 6,
            text: [
              "新人や在籍メンバーへの研修を担当するようになる。",
              "jQueryメインでコーディングしていたところを、理解向上を兼ねてバニラJSでも書く流れをつくる。"
            ]
          },
          {
            month: 10,
            text: [
              "別チームの受託制作へ定期的に参加し始める（EJS, WordPress等）"
            ]
          }
        ]
      },
      {
        year: 2020,
        details: [
          {
            month: 6,
            text: [
              "業務効率化のため、チーム向けのLP用コンポーネントを作成し始める。",
              "同じく効率化のため、VSCodeの拡張機能・コードスニペットをGitHubでの管理を始める。"
            ]
          },
          {
            month: 7,
            text: [
              "LP制作業務のローカルルールを制定する。"
            ]
          }
        ]
      },
      {
        year: 2021,
        details: [
          {
            month: 4,
            text: [
              "メンバーのコーディング力向上のため、専用の練習環境を構築する。（webpack, Gulp, EJS）"
            ]
          },
          {
            month: 10,
            text: [
              "週一で後輩への1on1（面談）を始める。"
            ]
          }
        ]
      },
      {
        year: 2022,
        details: [
          {
            month: 4,
            text: [
              "別チームの受託制作に後輩も参加させるため、教育を開始する。"
            ]
          },
          {
            month: 6,
            text: [
              "メンバーの査定担当を担い始める。"
            ]
          }
        ]
      },
      {
        year: 2023,
        details: [
          {
            month: 1,
            text: [
              "採用面接を担い始める。"
            ]
          },
          {
            month: 3,
            text: [
              "自社管理のECサイト業務に参加し始める。（Shopify）"
            ]
          },
          {
            month: 7,
            text: [
              "別チーム同士が進行していた制作案件に実装者として唯一参加させてもらう。（Nuxt.js）"
            ]
          }
        ]
      },
    ]
  }

  return NextResponse.json(data, { status: 200 });
}