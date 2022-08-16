<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{
    public function getPosts(Request $request)
    {
        $result = DB::select("SELECT
        [Post].[post_id],
        [Post].[user_id],
        [users].[nickname],
        [Post].[description],
        [Post].[address],
        [Post].[time_begin],
        [Post].[time_end],
        [star],
        [Post].[created_at],
        [Post].[updated_at],
        dbo.COUNT_POST_LIKE([Post].post_id) AS numLike,
        dbo.COUNT_POST_COMMENT([Post].post_id) AS numComment,
        dbo.CHECK_USER_LIKED_POST(?,[Post].post_id) AS liked
        FROM [Post],[users] 
        WHERE  [Post].[user_id]=[users].[id]
        ORDER BY [updated_at] DESC", 
        [$request->user()->id]);
        
        return response()->json([
            'success' => 'true',
            'posts' => $result
        ]);
    }

    public function getRank()
    {
        $result = DB::select("SELECT
		[users].[id],
        [users].[nickname],
        COUNT([Like].[user_id]) AS numLike
        FROM [users],[Like],[Post]
        WHERE [Post].[post_id] = [Like].[post_id] 
        AND [Post].[user_id] = [users].[id] group by [users].[nickname], [users].[id]
		order by numLike desc
        ");

        return response()->json([
            'success' => 'true',
            'ranks' => $result
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getPostComment(Request $request ,$post_id)
    {
        $result = DB::select("SELECT  
        [users].[id] AS user_id,
        [users].[nickname],
        [Comment].[content],
        [Comment].[comment_id],
        [Comment].[created_at],
        dbo.COUNT_COMMENT_LIKE([comment_id]) AS numLike,
        dbo.CHECK_USER_LIKED_COMMENT(?,[Comment].[comment_id]) AS Liked
        FROM [Comment],[users]
        WHERE [users].[id]=[Comment].[user_id] AND [post_id] = ?
        ORDER BY [Comment].[created_at] ASC",
        [$request->user()->id , $post_id]);

        return response()->json([
            'success' => 'true',
            'comments' => $result
        ]);
    }

    public function addPostComment(Request $request, $post_id)
    {
        DB::statement("INSERT INTO
        [Comment]([post_id], [user_id], [content])
        VALUES
        (?, ?, ?)",
        [$post_id, $request->user()->id, $request->content]);

        return response()->json([
            'success' => 'true',
            'message' => 'Comment created'
        ]);
    }

    public function likePost(Request $request,$post_id)
    {
        $result = DB::select("SELECT * FROM [Like]
        WHERE [post_id] = ? AND [user_id] = ?",
        [$post_id, $request->user()->id]);

        if (count($result) == 0) {
            DB::statement("INSERT INTO 
            [Like]([post_id], 
            [user_id]) VALUES (?, ?)", 
            [$post_id, $request->user()->id]);
            return response()->json([
                'success' => 'true',
                'action' => 'like'
            ]);
        }else {
            DB::statement("DELETE FROM [Like] 
            WHERE [post_id] = ? AND [user_id] = ?", 
            [$post_id, $request->user()->id]);
            return response()->json([
                'success' => 'true',
                'action' => 'dislike'
            ]);
        }
    }

    public function likeComment(Request $request,$comment_id)
    {
        $result = DB::select("SELECT * FROM [Like_Comment]
        WHERE [comment_id] = ? AND [user_id] = ?",
        [$comment_id, $request->user()->id]);

        if (count($result) == 0) {
            DB::statement("INSERT INTO 
            [Like_Comment]([comment_id], 
            [user_id]) VALUES (?, ?)", 
            [$comment_id, $request->user()->id]);
        }else {
            DB::statement("DELETE FROM [Like_Comment] 
            WHERE [comment_id] = ? AND [user_id] = ?", 
            [$comment_id, $request->user()->id]);
        }

        $result = DB::select('SELECT 
        dbo.COUNT_COMMENT_LIKE([comment_id]) AS numLikeComment
        FROM [Comment] WHERE [comment_id] = ?',
        [$comment_id]);

        return response()->json([
            'success' => 'true',
            'message' => 'Like comment successfully',
            'result' => $result
        ]);
    }

    // public function getNumLikesComments($post_id){
    //     $result = DB::select('SELECT 
    //         dbo.COUNT_POST_LIKE([Post].post_id) AS numLike,
    //         dbo.COUNT_POST_COMMENT([Post].post_id) AS numComment
    //         FROM [Post] WHERE [post_id] = ?',
    //         [$post_id]);
    //     return response()->json([
    //         'success' => 'true',
    //         'num' => $result
    //     ]);
    // }

    public function getImages(){    
        $result = DB::select("SELECT * FROM [Post_Image]");
        for($i = 0; $i < count($result); $i++){
            $result[$i]->image = Storage::url($result[$i]->image);
        }
        return response()->json([
            'success' => 'true',
            'images' => $result
        ]);
    }

    public function myPost(Request $request) {
        $result = DB::select("SELECT  
        [Post].[post_id],
        [Post].[user_id],
        [users].[nickname],
        [Post].[description],
        [Post].[address],
        [Post].[time_begin],
        [Post].[time_end],
        [Post].[star],
        [Post].[created_at],
        [Post].[updated_at],
        dbo.COUNT_POST_LIKE([Post].post_id) AS numLike,
        dbo.COUNT_POST_COMMENT([Post].post_id) AS numComment,
        dbo.CHECK_USER_LIKED_POST(?,[Post].post_id) AS liked
        FROM [Post],[users] 
        WHERE [Post].[user_id]=[users].[id]
        AND [users].[id] = ?
        ORDER BY [updated_at] DESC",
        [$request->user()->id, $request->user()->id]);

        return response()->json([
            'success' => 'true',
            'myPosts' => $result
        ]);
    }

    public function addPost(Request $request) {
        // check .jpg .png
        // ...
        try {
            $id = DB::table('Post')->insertGetId(
                ['user_id' => $request->user()->id, 'description' => $request->description, 'address' => $request->address, 'time_begin' => $request->time_begin, 'time_end' => $request->time_end, 'star' => $request->star]
            );
            
            foreach($request->file('images') as $filename){
                $path = Storage::putFile('public', $filename);
                DB::statement("INSERT INTO [Post_Image]([post_id],[image]) VALUES (?, ?)", [$id, $path]);
            }
            return response()->json([
                'success' => 'true',
                'message' => 'created post'
            ]);
        } catch (Exception $e){
            return response()->json([
                'success' => 'false',
                'message' => $e->getMessage()
            ]);
        }
    }   

    public function deletePost(Request $request, $post_id) {
        //check user's post

        $check = DB::delete("DELETE FROM [Post] WHERE [post_id] = ?", [$post_id]);
        if($check){
            return response()->json([
                'success' => 'true',
                'message' => 'deleted post'
            ]);
        }else{
            return response()->json([
                'success' => 'false'
            ]);
        }
    }

    public function updatePost(Request $request, $post_id) {
        // check .jpg .png
        // ...
        try {
            DB::statement("UPDATE [Post]
            SET [address] = ?, [description] = ?, [time_begin] = ?, [time_end] = ?, [star] = ?
            WHERE [post_id] = ?",
            [$request->address, $request->description, $request->time_begin, $request->time_end, $request->star, $post_id]);

            DB::statement("DELETE FROM [Post_Image] WHERE [post_id] = ?", [$post_id]);
            
            foreach($request->file('images') as $filename){
                $path = Storage::putFile('public', $filename);
                DB::statement("INSERT INTO [Post_Image]([post_id],[image]) VALUES (?, ?)", [$post_id, $path]);
            }

            return response()->json([
                'success' => 'true',
                'message' => 'updated post'
            ]);
        } catch(Exception $e) {
            return response()->json([
                'success' => 'false',
                'message' => $e->getMessage()
            ]);
        }
    }

    public function search(Request $request){
        // $result = DB::select("SELECT [address], [description], [time_begin], [time_end], [star]
        // from [Post]
        // WHERE (? IS NULL OR [address] LIKE N'%?%')
        // AND (? IS NULL OR [time_begin] >= ?)
        // AND (? IS NULL OR [time_end] <= ?)
        // AND (? IS NULL OR [star] >= ?)",
        // [
        //     $request->address,
        //     $request->address,
        //     $request->time_begin,
        //     $request->time_begin,
        //     $request->time_end,
        //     $request->time_end,
        //     $request->star,
        //     $request->star
        // ]);
        
        $result = DB::table('Post');
        if(!empty($request->address)){
            $result = $result->where('address','LIKE',"%{$request->address}%");
        }
        if(!empty($request->time_begin)){
            $result = $result->where('time_begin','>=',$request->time_begin);
        }
        if(!empty($request->time_end)){
            $result = $result->where('time_end','<=',$request->time_end);
        }
        if(!empty($request->star)){
            $result = $result->where('star','>=',$request->star);
        }

        return response()->json([
            'success' => 'true',
            'data' => $result->select('post_id')->get()
        ]);
    }
}

