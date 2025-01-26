const badgeDesign = {
  Unsettled: "badge-neutral text-white",
  Settled: "badge-success text-white",
  Archive: "badge-error",

  Scheduled: "badge-warning",
  Done: "badge-success",
  Cancelled: "badge-error",
  
  Investigating: "badge-warning",
  Reported: "badge-primary",
  Guilty: "badge-error",
  Dismissed: "badge-success",

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