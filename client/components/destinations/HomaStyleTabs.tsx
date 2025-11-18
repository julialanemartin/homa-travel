import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.js";

// Create a styled wrapper for the Homa-styled tabs
export function HomaStyleTabs({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className} {...props}>
      {children}
    </Tabs>
  );
}

// Homa-styled TabsList that explicitly uses the Homa teal color
export function HomaStyleTabsList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList 
      className={`grid grid-cols-3 w-full ${className}`} 
      style={{
        backgroundColor: "#2d8a9a",
        background: "#2d8a9a", 
        color: "white",
        borderRadius: "0.375rem",
      }}
      {...props}
    >
      {children}
    </TabsList>
  );
}

// Re-export TabsTrigger and TabsContent for consistent usage
export { TabsTrigger, TabsContent };