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
}