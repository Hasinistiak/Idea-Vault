import { supabase } from "../lib/supabase";

export const CreateIdea = async (idea) => {
    try {
  
      const { data, error } = await supabase
        .from('ideas')
        .insert(idea)
        .select()
        .single()
  
  
      if (error) {
        //console.log("Idea error:", error);
        return { success: false, msg: "Could not add the idea" };
      }
  
      return { success: true, data: data };
  
    } catch (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not add the idea" };
    }
  };


  export const fetchUserIdeas = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('userId', userId)
        .eq('state', 'idea')
        .order('created_at', { ascending: false });  
  
      if (error) {
        //console.log("Error fetching user ideas:", error);
        return { success: false, msg: "Could not fetch ideas" };
      }
  
      //console.log("Fetched ideas for user:", data);
  
      return { success: true, data: data };
    } catch (error) {
      //console.log("Unexpected error in fetchUserIdeas:", error);
      return { success: false, msg: "An unexpected error occurred" };
    }
  };

  export const UpdateIdea = async (userId, idea, ideaId) => {
    try {
  
      const { data, error } = await supabase
        .from('ideas')
        .update(idea)
        .eq('userId', userId)
        .eq('id', ideaId)
  
  
      if (error) {
        //console.log("Idea error:", error);
        return { success: false, msg: "Could not add the idea" };
      }
  
      return { success: true, data: data };
  
    } catch (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not add the idea" };
    }
  };

  export const RemoveIdea = async (userId, ideaId) => {
    try {
  
      const { data, error } = await supabase
        .from('ideas')
        .delete()
        .eq('userId', userId)
        .eq('id', ideaId)
  
  
      if (error) {
        //console.log("Idea error:", error);
        return { success: false, msg: "Could not add the idea" };
      }
  
      return { success: true, data: data };
  
    } catch (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not add the idea" };
    }
  };

  export const fetchUserDoLaters = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('userId', userId)
        .eq('state', 'doLater')
        .order('created_at', { ascending: false });  
  
      if (error) {
        //console.log("Error fetching user ideas:", error);
        return { success: false, msg: "Could not fetch ideas" };
      }
  
      //console.log("Fetched ideas for user:", data);
  
      return { success: true, data: data };
    } catch (error) {
      //console.log("Unexpected error in fetchUserIdeas:", error);
      return { success: false, msg: "An unexpected error occurred" };
    }
  };

  export const fetchUserExecutions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('userId', userId)
        .eq('state', 'execution')
        .order('created_at', { ascending: false });  
  
      if (error) {
        //console.log("Error fetching user ideas:", error);
        return { success: false, msg: "Could not fetch ideas" };
      }
  
      //console.log("Fetched ideas for user:", data);
  
      return { success: true, data: data };
    } catch (error) {
      //console.log("Unexpected error in fetchUserIdeas:", error);
      return { success: false, msg: "An unexpected error occurred" };
    }
  };



  export const GetIdeaDetails = async (ideaId) => {
    try {
      const { data, error } = await supabase
        .from('ideas') // Replace with your table name
        .select('feasibility, impact, scalability, excitement')
        .eq('id', ideaId)
        .single();
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching idea details:', error);
      return null;
    }
  };
  