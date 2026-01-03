export type Conversation = { id: string; title: string; lastMessage?: string; members: string[] };
export type Message = {
  id: string;
  from: string;
  text?: string;
  type?: 'text' | 'image' | 'audio';
  contentUrl?: string;
  ts: number;
  mine?: boolean;
  reactions?: string[];
  replyTo?: string; // ID of message being replied to
  isStarred?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  isSecret?: boolean; // For disappearing messages
};

const sleep = (ms = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

let convs: Conversation[] = [
  { id: 'c1', title: 'Besties', members: ['alice', 'you'] },
  { id: 'c2', title: 'Work', members: ['bob', 'you'] }
];
const messages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', from: 'alice', text: 'hey!', ts: Date.now() - 1000 * 60 * 60, mine: false },
    { id: 'm2', from: 'you', text: 'hi 👋', ts: Date.now() - 1000 * 60 * 30, mine: true }
  ],
  c2: [{ id: 'm3', from: 'bob', text: 'standup at 10', ts: Date.now() - 1000 * 60 * 10, mine: false }]
};

export async function apiLogin(_email: string, password: string) {
  await sleep(700);
  if (password !== 'password') throw new Error('Invalid credentials');
  return { id: 'you', name: 'Demo User', token: 'demo-token' };
}
export async function apiSignup(name: string, _email: string, _password: string) {
  await sleep(700);
  return { id: 'you', name, token: 'demo-token' };
}
export async function apiGetConversations(): Promise<Conversation[]> {
  await sleep(400);
  return convs;
}
export async function apiGetMessages(convId: string): Promise<Message[]> {
  await sleep(400);
  return messages[convId] || [];
}
export async function apiSendMessage(convId: string, text: string) {
  await sleep(200);
  const m: Message = { id: String(Math.random()), from: 'you', text, ts: Date.now(), mine: true };
  messages[convId] = messages[convId] || [];
  messages[convId].push(m);
  return m;
}
