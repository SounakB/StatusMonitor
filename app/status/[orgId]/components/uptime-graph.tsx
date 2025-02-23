"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UptimeData = {
  date: string
  uptime: number | null
}

type UptimeGraphProps = {
  orgId: string
  serviceId: string
  serviceName: string
}

export function UptimeGraph({ orgId, serviceId, serviceName }: UptimeGraphProps) {
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([])
  const [timeRange, setTimeRange] = useState("30")

  useEffect(() => {
    const fetchUptimeData = async () => {
      try {
        const response = await fetch(`/api/organizations/${orgId}/services/${serviceId}/uptime?days=${timeRange}`)
        if (!response.ok) {
          throw new Error("Failed to fetch uptime data")
        }
        const data = await response.json()
        setUptimeData(data)
      } catch (error) {
        console.error("Error fetching uptime data:", error)
      }
    }

    fetchUptimeData()
  }, [orgId, serviceId, timeRange])

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{serviceName} Uptime</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={uptimeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="uptime" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

