import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, UserIcon, Zap, RotateCcw, PlusCircle, MessageSquare } from 'lucide-react'

type Message = {
  id: number
  text: string
  sender: 'user' | 'bot'
}

type Conversation = {
  id: number
  name: string
  messages: Message[]
}

export default function ValorantChatbot() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      name: 'New Chat',
      messages: [{ id: 1, text: "Greetings, Agent. KAY/0 AI online. What intel do you require?", sender: 'bot' }]
    }
  ])
  const [activeConversation, setActiveConversation] = useState<number>(1)
  const [input, setInput] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversations])

  const handleSend = () => {
    if (input.trim()) {
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  { id: conv.messages.length + 1, text: input, sender: 'user' }
                ]
              }
            : conv
        )
      )
      setInput('')
      // Simulate bot response (you'd replace this with actual AI logic)
      setTimeout(() => {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === activeConversation
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    { id: conv.messages.length + 2, text: "Processing your request, Agent. Stand by for data analysis.", sender: 'bot' }
                  ]
                }
              : conv
          )
        )
      }, 1000)
    }
  }

  const addNewConversation = () => {
    const newConversation: Conversation = {
      id: conversations.length + 1,
      name: `New Chat ${conversations.length + 1}`,
      messages: [{ id: 1, text: "New mission briefing. What's your status, Agent?", sender: 'bot' }]
    }
    setConversations([...conversations, newConversation])
    setActiveConversation(newConversation.id)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="w-64 bg-indigo-900 p-4 overflow-y-auto">
        <Button 
          onClick={addNewConversation}
          className="w-full mb-4 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Chat
        </Button>
        {conversations.map((conv) => (
          <Button
            key={conv.id}
            onClick={() => setActiveConversation(conv.id)}
            className={`w-full mb-2 justify-start ${
              activeConversation === conv.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                : 'bg-indigo-800 hover:bg-indigo-700'
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {conv.name}
          </Button>
        ))}
      </div>
      <div className="flex flex-col flex-grow">
        <header className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-6 text-center shadow-lg">
          <h1 className="text-4xl font-bold tracking-wider text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>KAY/0 AI INTERFACE</h1>
        </header>
        <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
          {conversations.find(conv => conv.id === activeConversation)?.messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 ml-auto' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500'
              } max-w-[80%] shadow-md`}
            >
              <div className="flex items-center mb-2">
                {message.sender === 'user' ? (
                  <div className="bg-cyan-300 rounded-full p-1 mr-2">
                    <UserIcon className="w-5 h-5 text-cyan-800" />
                  </div>
                ) : (
                  <div className="bg-pink-300 rounded-full p-1 mr-2">
                    <Zap className="w-5 h-5 text-pink-800" />
                  </div>
                )}
                <span className="font-bold">{message.sender === 'user' ? 'You' : 'KAY/0 AI'}</span>
              </div>
              <p className="text-sm md:text-base">{message.text}</p>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 bg-gradient-to-t from-indigo-900 to-blue-800">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your command, Agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow bg-indigo-700 text-white border-yellow-500 placeholder-indigo-300"
            />
            <Button onClick={handleSend} className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 transition-all duration-200 text-white">
              <SendIcon className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
        <footer className="bg-indigo-900 p-2 text-center text-xs text-indigo-200">
          <Button variant="ghost" size="sm" className="text-indigo-200 hover:text-white hover:bg-indigo-800">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Chat
          </Button>
        </footer>
      </div>
    </div>
  )
}