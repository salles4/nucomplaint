// @ts-nocheck
import { supabase } from "../supabase"

/**
 * 
 * @param user_id {number} - User to be notified
 * @param type {string} - type of notification
 * @param message {String} - message of notification
 * @param related_id {number} - Id to redirect into
 */
export const addNotification = async (user_id, type, message, related_id) => {
  const {error} = await supabase
  .from("notifications")
  .upsert({
    user_id: user_id,
    type: type,
    message: message,
    related_id: related_id,
  })
  
  if(error){
    console.error(error);
    return;
  }
  console.log('inserted Notif');
}

export const notifyStaff = async (type, message, related_id) => {
  const {data: staff_ids, error: staff_idsError} = await supabase
  .from("users")
  .select("user_id")
  .eq("account_type", 'staff')

  if(staff_idsError){
    console.error(staff_idsError);
    return;
  }
  staff_ids.map(staff_id => {
    addNotification(staff_id.user_id, type, message, related_id);
  })
}