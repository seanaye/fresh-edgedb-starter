import { Builder } from "./builder.ts";

export type DB<T> = Omit<T, "__type__">

export type BuilderFn = (builder: Builder) => Builder
