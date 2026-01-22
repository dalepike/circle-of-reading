/**
 * MicroHeader Component - Usage Examples
 *
 * This file demonstrates how to use the MicroHeader component
 * in various scenarios within the Circle of Reading redesign.
 */

import { useState } from "react";
import { MicroHeader } from "./MicroHeader";

// Example 1: Basic Usage in Reader Layout
export function ReaderLayoutExample() {
  const [jumpDrawerOpen, setJumpDrawerOpen] = useState(false);

  return (
    <>
      <MicroHeader
        week={16}
        title="The Darling"
        month="June"
        russianTitle="Душечка"
        volume={41}
        onHeaderClick={() => setJumpDrawerOpen(true)}
        onPrevClick={() => console.log("Navigate to W15")}
        onNextClick={() => console.log("Navigate to W17")}
        onIndexClick={() => console.log("Navigate to index")}
        hasPrev={true}
        hasNext={true}
      />

      {/* Jump Drawer would go here */}
      {jumpDrawerOpen && (
        <div>Jump Drawer Component</div>
      )}
    </>
  );
}

// Example 2: First Week (W01) - No Previous
export function FirstWeekExample() {
  return (
    <MicroHeader
      week={1}
      title="The Thief's Son"
      month="January"
      russianTitle="Сын вора"
      volume={41}
      onHeaderClick={() => {}}
      onPrevClick={() => {}}
      onNextClick={() => console.log("Navigate to W02")}
      onIndexClick={() => console.log("Navigate to index")}
      hasPrev={false}  // Disabled - first week
      hasNext={true}
    />
  );
}

// Example 3: Last Week (W52) - No Next
export function LastWeekExample() {
  return (
    <MicroHeader
      week={52}
      title="Love One Another"
      month="December"
      russianTitle="Любите друг друга"
      volume={42}
      onHeaderClick={() => {}}
      onPrevClick={() => console.log("Navigate to W51")}
      onNextClick={() => {}}
      onIndexClick={() => console.log("Navigate to index")}
      hasPrev={true}
      hasNext={false}  // Disabled - last week
    />
  );
}

// Example 4: With Router Integration (Astro example)
export function WithRouterExample() {
  const handleNavigate = (weekNumber: number) => {
    window.location.href = `/week/W${weekNumber.toString().padStart(2, "0")}`;
  };

  const handleIndexNavigate = () => {
    window.location.href = "/";
  };

  return (
    <MicroHeader
      week={22}
      title="The Darling"
      month="June"
      onHeaderClick={() => {
        // Open jump drawer
        const event = new CustomEvent("open-jump-drawer");
        window.dispatchEvent(event);
      }}
      onPrevClick={() => handleNavigate(21)}
      onNextClick={() => handleNavigate(23)}
      onIndexClick={handleIndexNavigate}
      hasPrev={true}
      hasNext={true}
    />
  );
}

// Example 5: Responsive Testing States
export function ResponsiveExample() {
  return (
    <div className="space-y-4">
      {/* Mobile viewport simulation */}
      <div className="max-w-sm border border-gray-800 light:border-gray-200">
        <MicroHeader
          week={16}
          title="The Darling"
          month="June"
          onHeaderClick={() => {}}
          onPrevClick={() => {}}
          onNextClick={() => {}}
          onIndexClick={() => {}}
          hasPrev={true}
          hasNext={true}
        />
      </div>

      {/* Tablet viewport simulation */}
      <div className="max-w-2xl border border-gray-800 light:border-gray-200">
        <MicroHeader
          week={16}
          title="The Darling"
          month="June"
          volume={41}
          onHeaderClick={() => {}}
          onPrevClick={() => {}}
          onNextClick={() => {}}
          onIndexClick={() => {}}
          hasPrev={true}
          hasNext={true}
        />
      </div>

      {/* Desktop viewport simulation */}
      <div className="border border-gray-800 light:border-gray-200">
        <MicroHeader
          week={16}
          title="The Darling"
          month="June"
          russianTitle="Душечка"
          volume={41}
          onHeaderClick={() => {}}
          onPrevClick={() => {}}
          onNextClick={() => {}}
          onIndexClick={() => {}}
          hasPrev={true}
          hasNext={true}
        />
      </div>
    </div>
  );
}

// Example 6: With State Management
export function WithStateManagementExample() {
  const [currentWeek, setCurrentWeek] = useState(16);

  const weeks = [
    { number: 15, title: "Previous Reading", month: "April" },
    { number: 16, title: "The Darling", month: "June" },
    { number: 17, title: "The Repentant Sinner", month: "April" },
  ];

  const currentWeekData = weeks.find(w => w.number === currentWeek);

  return (
    <MicroHeader
      week={currentWeekData!.number}
      title={currentWeekData!.title}
      month={currentWeekData!.month}
      onHeaderClick={() => console.log("Open jump drawer")}
      onPrevClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
      onNextClick={() => setCurrentWeek(prev => Math.min(52, prev + 1))}
      onIndexClick={() => console.log("Navigate to index")}
      hasPrev={currentWeek > 1}
      hasNext={currentWeek < 52}
    />
  );
}

// Example 7: Long Title Truncation Test
export function LongTitleExample() {
  return (
    <MicroHeader
      week={28}
      title="The Order of the World and the Limitations of Human Understanding"
      month="July"
      volume={42}
      onHeaderClick={() => {}}
      onPrevClick={() => {}}
      onNextClick={() => {}}
      onIndexClick={() => {}}
      hasPrev={true}
      hasNext={true}
    />
  );
}
