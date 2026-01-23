/**
 * Visitor state types for Circle of Reading visitor tracking
 */

export interface VisitorState {
  introduced: boolean;           // Has seen welcome narrative
  acknowledgedRedesign: boolean; // For existing users: has seen "welcome back"
}
