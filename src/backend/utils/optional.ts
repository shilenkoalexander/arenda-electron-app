export default class Optional<T> {
    static of<B>(value: B | null): Optional<B> {
        return new Optional<B>(value);
    }

    static empty<B>(): Optional<B> {
        return new Optional<B>(null);
    }

    private readonly value: T | null = null;

    private constructor(value: T | null) {
        this.value = value;
    }

    public isPresent(): boolean {
        return this.value !== null;
    }

    public ifPresent(func: (value: T) => void) {
        if (this.isPresent()) {
            func(this.value as T);
        }
    }

    public orElse(otherValue: T): T {
        if (this.isPresent()) {
            return this.value as T;
        }
        return otherValue;
    }

    public map<B>(map: (value: T) => B): Optional<B> {
        if (this.isPresent()) {
            return Optional.of(map(this.value as T));
        }
        return Optional.empty();
    }

    public get(): T {
        if (this.isPresent()) {
            return this.value as T;
        }
        throw new Error('Optional is empty');
    }
}
