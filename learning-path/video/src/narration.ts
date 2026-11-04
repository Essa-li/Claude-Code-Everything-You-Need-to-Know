// Chinese voiceover per scene. scripts/voiceover.mjs turns each line into
// public/voice/<lesson>/<scene>.mp3 and records its length in src/voice.gen.json.
export const NARRATION: Record<string, Record<string, string>> = {
  "b-1": {
    Hook: "让 AI 帮你核对一份客户资料，它说得头头是道。可是，它说对了吗？这一课，教你装好 Claude Code，再学会一招：拿证据核对它的话。",
    Install: "第一步，安装。一行命令装好，新开一个终端，输入 claude 减减 version，看到版本号就成功了。",
    Start: "第二步，进入练习仓库的 project 文件夹启动它。看到信任对话框，先别急着回车：自己的仓库，读完再信任；别人的仓库，先退出，查一查它的设置。",
    Status: "第三步，输入斜杠 status，版本、模型、账号，一屏看清。和同事的不一样时，先对比账号这几行。",
    Esc: "回答跑偏了？按 Esc，它立刻停下，已经做好的部分还在。",
    Verify: "最关键的一招：它说什么，你就打开对应的文件看一眼。它说配置在 config 点 js，打开一看，开头写得清清楚楚。",
    Takeaways: "记住三件事：只信任认识的仓库；斜杠 status 看清账号；Esc 叫停，拿证据核对。",
    Quiz: "考你一题：别人的仓库，信任对话框该怎么选？三，二，一。答案：先退出，读完它的设置再决定。",
    Outro: "现在回到网页，跟着步骤动手做，再完成那道入职笔记纠错题。",
  },
};
