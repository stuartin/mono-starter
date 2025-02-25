import { WASI } from "@cloudflare/workers-wasi";
// @ts-expect-error wasm module
import argon2 from './argon2-wasi.wasm'; // https://github.com/auth70/argon2-wasi
import { Context } from "#lib/yoga";

export async function invoke(args: string[], ctx: Context) {
    const stdout = new TransformStream();
    const stderr = new TransformStream();
    const wasi = new WASI({
        args: ["argon2-wasi.wasm", ...args],
        stdout: stdout.writable,
        stderr: stderr.writable,
    });
    const instance = new WebAssembly.Instance(argon2, {
        wasi_snapshot_preview1: wasi.wasiImport,
    });

    // @ts-expect-error promise not correct type
    ctx.waitUntil(wasi.start(instance));

    // await wasi.start(instance);
    const errors = await stderr.readable.getReader().read();
    const errorsValue = new TextDecoder().decode(errors.value);
    if (errorsValue) {
        console.error('[invoke] stderr: ', errorsValue);
        throw new Error(errorsValue);
    }
    const ret = await stdout.readable.getReader().read();
    const retValue = new TextDecoder().decode(ret.value);
    return retValue.trim();
}

export async function argon2Hash(password: string, ctx: Context): Promise<string> {
    return await invoke(["hash", password], ctx);
}

export async function argon2Verify(password: string, hash: string, ctx: Context): Promise<boolean> {
    return await invoke(["verify", password, hash], ctx) === "true";
}