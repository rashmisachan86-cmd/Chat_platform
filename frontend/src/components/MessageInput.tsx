import React, {useState} from "react";

export default function MessageInput({onSend}:{onSend:(t:string)=>void}){
  const [text,setText]=useState("");
  function submit(e?:React.FormEvent){
    e?.preventDefault();
    if(!text.trim()) return;
    onSend(text.trim()); setText("");
  }
  return (
    <form onSubmit={submit} className="flex gap-3">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message" className="flex-1 px-4 py-3 border rounded-full focus:outline-none"/>
      <button className="px-4 py-2 bg-primary text-white rounded-full">Send</button>
    </form>
  );
}
