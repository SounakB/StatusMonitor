import { Badge } from "@/components/ui/badge"

type IncidentMessage = {
  id: string
  content: string
  status: string
  createdAt: string
}

type IncidentTimelineProps = {
  messages: IncidentMessage[]
}

export function IncidentTimeline({ messages }: IncidentTimelineProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={message.id} className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Badge variant={message.status === "resolved" ? "success" : "destructive"}>{message.status}</Badge>
          </div>
          <div className="flex-grow">
            <p className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
            <p className="mt-1">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

