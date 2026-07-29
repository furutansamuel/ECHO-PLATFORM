import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function PostFeed(){

const [posts,setPosts] = useState<any[]>([]);

useEffect(()=>{

async function loadPosts(){

const {data,error}=await supabase
.from("posts")
.select("*")
.order("created_at",{ascending:false});

if(!error){
 setPosts(data);
}

}

loadPosts();

},[]);


return (
<div className="space-y-4">

{posts.map(post=>(
<div key={post.id}
className="border rounded-xl p-4">

<h3 className="font-bold">
{post.title}
</h3>

<p>{post.content}</p>

<span className="text-sm text-muted-foreground">
{new Date(post.created_at).toLocaleDateString()}
</span>

</div>
))}

</div>
)

}
