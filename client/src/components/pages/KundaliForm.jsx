'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from 'react-hot-toast'
import { sendDataAstrology } from '@/api/server'
import useKundaliContext from '@/contexts/KundaliContext'

export default function KundaliForm() {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    date: '',
    time: '',
    latitude: '',
    longitude: '',
    timezone: '',
    config: {
      observation_point: 'topocentric',
      ayanamsha: 'lahiri'
    }
  })

  const { setData } = useKundaliContext();

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [hours, minutes, seconds = '0'] = formData.time.split(':');

    const processedData = {
      ...formData,
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds),
      year: parseInt(formData.year),
      month: parseInt(formData.month),
      date: parseInt(formData.date),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      timezone: parseFloat(formData.timezone)
    }

    delete processedData.time

    try {
      // const {
      //   tithi, karna, yoga, nakshatra
      // } = await panchangDetails(processedData);

      // generate Navamsa chart
      const [navasmaChart, planetsChart] = await Promise.all([
        sendDataAstrology("navamsa-chart-info", "POST", processedData),
        sendDataAstrology("planets", "POST", processedData),
      ]);
      setData({
        userInputs: processedData,
        navasmaChart: navasmaChart.output,
        planetsChart: planetsChart.output
      })

    } catch (error) {
      console.error(error)
      toast.error(error.message || "Please try again later!");
    }
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Astrological Data Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="1976"
                  required
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="6"
                  required
                  value={formData.month}
                  onChange={(e) => handleChange('month', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="number"
                  min="1"
                  max="31"
                  placeholder="10"
                  required
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
            </div>

            {/* Time and Timezone Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  step="1"
                  required
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  type="number"
                  step="0.5"
                  placeholder="5.5"
                  required
                  value={formData.timezone}
                  onChange={(e) => handleChange('timezone', e.target.value)}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="18.933"
                  required
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="72.8166"
                  required
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                />
              </div>
            </div>

            {/* Configuration Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="observation_point">Observation Point</Label>
                <Select
                  value={formData.config.observation_point}
                  onValueChange={(value) => handleChange('config.observation_point', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select observation point" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="topocentric">Topocentric</SelectItem>
                    <SelectItem value="geocentric">Geocentric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ayanamsha">Ayanamsha</Label>
                <Select
                  value={formData.config.ayanamsha}
                  onValueChange={(value) => handleChange('config.ayanamsha', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ayanamsha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lahiri">Lahiri</SelectItem>
                    <SelectItem value="raman">Raman</SelectItem>
                    <SelectItem value="krishnamurti">Krishnamurti</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}