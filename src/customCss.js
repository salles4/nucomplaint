const badgeDesign = {
  Unsettled: "badge-neutral",
  Settled: "badge-success badge-outline",
  Archive: "badge-error badge-outline",

  Scheduled: "badge-warning",
  Done: "badge-success",
  Cancelled: "badge-error",
  
  Investigating: "badge-error",

  Unread:"badge-neutral"
}

/**
 * @param {string} status Current status
 * 
 * @returns {string} Tailwind classname design for current status
 */
export function badge(status){
  return badgeDesign[status] || "badge-neutral badge-outline";
}