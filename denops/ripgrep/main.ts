import { Denops, ensureArray, io } from "./deps.ts";
import { addloclist, clearloclist, QFList } from "./utils.ts";

export async function main(denops: Denops): Promise<void> {
  await denops.cmd(
    `command! -nargs=+ Ripgrep call denops#notify("${denops.name}", "grep", [<f-args>])`,
  );

  denops.dispatcher = {
    async grep(...arg: unknown[]): Promise<void> {
      const cmd = ["rg", "--vimgrep"].concat(ensureArray(arg));
      const opts = {
        cmd: cmd,
        stderr: "piped",
        stdout: "piped",
        stdin: "null",
        cwd: await denops.call("getcwd"),
      } as Deno.RunOptions;
      const p = Deno.run(opts);
      if (!p.stdout) {
        p.close();
        console.error(new TextDecoder().decode(await p.stderrOutput()));
        return;
      }

      const qflist: QFList[] = [];
      let founded = false;
      for await (const line of io.readLines(p.stdout)) {
        if (!founded) {
          await clearloclist(denops);
          founded = true;
        }
        const cols = line.split(":");
        const [filename, lnum, col] = cols;
        const text = cols.splice(3).join(":");
        const qf = {
          filename: filename,
          lnum: parseInt(lnum),
          col: parseInt(col),
          text,
        } as QFList;
        qflist.push(qf);

        if (qflist.length == 1000) {
          await addloclist(denops, qflist);
          qflist.splice(0);
        }
      }

      if (qflist.length) {
        await addloclist(denops, qflist);
      }
      if (founded) {
        await denops.cmd("lopen");
      } else {
        console.error("not found");
      }
      p.close();
    },
  };
}
