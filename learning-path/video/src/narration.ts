// Chinese voiceover per scene. scripts/voiceover.mjs turns each line into
// public/voice/<lesson>/<scene>.mp3 and records its length in src/voice.gen.json.
export const NARRATION: Record<string, Record<string, string>> = {
  "b-1": {
    Title: "第一课：安装、登录、熟悉界面。这段动画是示意，具体操作以网页上的步骤为准。",
    Windows: "开始之前，先开好两个终端窗口。窗口 A 运行 Claude Code，窗口 B 是普通终端，用来运行 git 和 npm。网页上每一步都会标明在哪个窗口操作。",
    Install: "第一步，在窗口 B 运行安装命令。装完以后，新开一个终端窗口，输入 claude 减减 version。看到版本号，后面跟着 Claude Code，就说明装好了。",
    Start: "进入练习仓库的 project 文件夹，运行 claude。第一次启动要登录，在浏览器里完成。接着会出现信任对话框：只信任你清楚来源的文件夹。自己的练习仓库，读完对话框就可以选择信任。",
    Status: "在会话里输入 斜杠 status，一次看清版本、模型和账号。如果你的会话和同事的不一样，先对比账号这几行。看完按 Esc 关闭。",
    Interrupt: "问它这个项目是做什么的，在它回答到一半的时候，按一下 Esc。Claude 会停下来等你，已经做完的部分会保留。然后再问一次，让它答完。",
    Verify: "把它的回答当成新同事的话来对待。打开 src 目录下的 config.js 自己核对：开头几行写着，它负责解析 linkcheck 点 json，读取 files 和 ignore 两个字段。",
    YourTurn: "自己练一遍。同事的入职笔记里，有一条说法和代码对不上。用 at 符号把笔记带进提示，让 Claude 逐条核对；再亲自打开它引用的那一行，以代码为准改正，最后提交。",
    Check: "最后在窗口 B 运行检查命令。两项都显示 PASS，就过关了，再去做网页上的过关小测。",
    End: "现在回到网页，跟着步骤动手做一遍。",
  },
};
