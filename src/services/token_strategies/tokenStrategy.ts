export interface TokenStrategy {
  doTasks: (email: string) => void;
}

export default TokenStrategy;
