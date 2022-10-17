declare interface Fetcher {
  fetch({ fake }: { fake: boolean }): Promise<void>;
  getMessagesForTab(): string[];
  getMessagesForConsole(): string[][];
}
