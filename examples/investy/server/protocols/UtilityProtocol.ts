export type Awaited<T> = T extends PromiseLike<infer U> ? U : T

export type PartialMap<Key extends (string | number | symbol), Value> = {
	[key in Key]?: Value
}
