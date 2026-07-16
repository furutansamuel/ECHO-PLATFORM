import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function CreatePost() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handlePost() {
    if (!user) return;

    const { error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title,
        content,
      });

    if (error) {
      console.error(error);
    } else {
      setTitle("");
      setContent("");
      alert("Post created");
    }
  }

  return (
    <div className="space-y-3">
      <input
        className="border p-2 w-full rounded"
        placeholder="Post title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full rounded"
        placeholder="Share an environmental update..."
        value={content}
        onChange={(e)=>setContent(e.target.value)}
      />

      <Button onClick={handlePost}>
        Publish Post
      </Button>
    </div>
  );
}
