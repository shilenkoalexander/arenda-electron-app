export interface Mapper<A, B> {
    transform(o: A): B;
}
