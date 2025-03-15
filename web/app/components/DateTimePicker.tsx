"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateTimePicker({
  selectedDate,
  onDateChange,
}: DateTimePickerProps) {
  const [date, setDate] = useState(selectedDate);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"calendar" | "time">("calendar");

  // Update local state when prop changes
  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateCalendar = () => {
    const today = new Date();
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const firstDayOfMonth = currentMonth.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isSelected =
        currentDate.getDate() === date.getDate() &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getFullYear() === date.getFullYear();
      const isPast = currentDate < new Date(today.setHours(0, 0, 0, 0));

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setDate(day);
            handleDateChange(newDate);
          }}
          disabled={isPast}
          className={`h-8 w-8 rounded-md flex items-center justify-center font-mono text-sm
            ${isSelected ? "bg-green-600 text-black" : "hover:bg-gray-700"}
            ${isPast ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const generateTimeSelector = () => {
    const hours = [];
    const minutes = [];

    // Generate hours (0-23)
    for (let hour = 0; hour < 24; hour++) {
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? "AM" : "PM";
      hours.push(
        <button
          key={hour}
          type="button"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setHours(hour);
            handleDateChange(newDate);
          }}
          className={`px-2 py-1 rounded-md font-mono text-2xl
            ${
              date.getHours() === hour
                ? "bg-green-600 text-black"
                : "hover:bg-gray-700"
            }
          `}
        >
          {displayHour} {period}
        </button>
      );
    }

    // Generate minutes (0, 15, 30, 45)
    for (const minute of [0, 15, 30, 45]) {
      minutes.push(
        <button
          key={minute}
          type="button"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setMinutes(minute);
            handleDateChange(newDate);
          }}
          className={`px-2 py-1 rounded-md font-mono text-2xl
            ${
              date.getMinutes() === minute
                ? "bg-green-600 text-black"
                : "hover:bg-gray-700"
            }
          `}
        >
          {minute.toString().padStart(2, "0")}
        </button>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="font-pixel text-xl mb-2">Hour</div>
          <div className="grid grid-cols-4 gap-1">{hours}</div>
        </div>
        <div>
          <div className="font-pixel text-xl mb-2">Minute</div>
          <div className="flex gap-1">{minutes}</div>
        </div>
      </div>
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const changeMonth = (increment: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + increment);
    setDate(newDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start font-mono text-left text-2xl"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 bg-gray-800 pixelated-border">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("calendar")}
              className={`font-pixel text-xl ${
                view === "calendar" ? "bg-gray-700" : ""
              }`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("time")}
              className={`font-pixel text-xl ${
                view === "time" ? "bg-gray-700" : ""
              }`}
            >
              <Clock className="mr-2 h-4 w-4" />
              Time
            </Button>
          </div>

          {view === "calendar" ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeMonth(-1)}
                  className="font-pixel text-xl"
                >
                  &lt;
                </Button>
                <div className="font-pixel text-2xl">
                  {monthNames[date.getMonth()]} {date.getFullYear()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => changeMonth(1)}
                  className="font-pixel text-xl"
                >
                  &gt;
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="h-8 w-8 flex items-center justify-center font-pixel text-xl text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
            </div>
          ) : (
            generateTimeSelector()
          )}

          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="font-pixel text-xl"
            >
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
