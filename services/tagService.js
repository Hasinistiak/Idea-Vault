import { supabase } from "../lib/supabase";


export const CreateTag = async (tag) => {
    try {
  
      const { data, error } = await supabase
        .from('tags')
        .insert(tag)
        .select()
        .single()
  
  
      if (error) {

        return { success: false, msg: "Could not add the tag" };
      }
  
      return { success: true, data: data };
  
    } catch (error) {
 
      return { success: false, msg: "Could not add the tag" };
    }
  };


  export const fetchUserTags = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .eq('userId', userId)
  
      if (error) {

        return { success: false, msg: "Could not fetch tags" };
      }
  
      return { success: true, data: data };
    } catch (error) {
      return { success: false, msg: "An unexpected error occurred" };
    }
  };

  export const fetchIdeaTags = async (ideaId) => {
    try {
      const { data, error } = await supabase
        .from('idea_tags')
        .select(`*,
          tags (*)`)
        .eq('idea_id', ideaId)

      if (error) {

        return { success: false, msg: "Could not fetch tags" };
      }
  
      return { success: true, data: data };
    } catch (error) {
      return { success: false, msg: "An unexpected error occurred" };
    }
};


export const AddIdeaTag = async (tag) => {
  try {

    const { data, error } = await supabase
      .from('idea_tags')
      .insert(tag)
      .select()
      .single()


    if (error) {

      return { success: false, msg: "Could not add the tag" };
    }

    return { success: true, data: data };

  } catch (error) {

    return { success: false, msg: "Could not add the tag" };
  }
};

export const RemoveIdeaTag = async (tagId, ideaId) => {
  try {

    const { data, error } = await supabase
      .from('idea_tags')
      .delete()
      .eq('tag_id', tagId)
      .eq('idea_id', ideaId)


    if (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not remove the idea" };
    }

    return { success: true, data: data };

  } catch (error) {
    //console.log("Idea error:", error);
    return { success: false, msg: "Could not remove the idea" };
  }
};


export const fetchTaggedIdeas = async (tagId) => {
  try {
    const { data, error } = await supabase
      .from('idea_tags')
      .select(`*,
        ideas (*)`)
      .eq('tag_id', tagId)

    if (error) {

      return { success: false, msg: "Could not fetch tags" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, msg: "An unexpected error occurred" };
  }
};

export const RemoveTag = async (userId, tagId) => {
  try {

    const { data, error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId)
      .eq('userId', userId)


    if (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not remove the idea" };
    }

    return { success: true, data: data };

  } catch (error) {
    //console.log("Idea error:", error);
    return { success: false, msg: "Could not remove the idea" };
  }
};


export const UpdateTag = async (userId, tag, tagId) => {
  try {

    const { data, error } = await supabase
      .from('tags')
      .update(tag)
      .eq('userId', userId)
      .eq('id', tagId)


    if (error) {
      //console.log("Idea error:", error);
      return { success: false, msg: "Could not add the tag" };
    }

    return { success: true, data: data };

  } catch (error) {
    //console.log("Idea error:", error);
    return { success: false, msg: "Could not add the tag" };
  }
};
