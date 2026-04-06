<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Mail;
use App\Mail\NewChatMessageMailable;

class ChatController extends Controller
{
    // ─── USER METHODS ───────────────────────────────────────────────

    // GET /api/chat/messages/{request_id}
    public function getUserMessages(Request $request, $requestId)
    {
        $user = $request->user;

        // Verify the request belongs to the user
        $clientRequest = DB::table('client_requests')
            ->where('id', $requestId)
            ->where('user_id', $user->id)
            ->first();

        if (!$clientRequest) {
            return response()->json(['success' => false, 'message' => 'Request not found or unauthorized.'], 403);
        }

        $messages = DB::table('client_messages')
            ->where('request_id', $requestId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark admin messages as read
        DB::table('client_messages')
            ->where('request_id', $requestId)
            ->where('sender_type', 'admin')
            ->update(['is_read' => 1]);

        $isAdminTyping = Cache::has("typing_{$requestId}_admin");

        return response()->json([
            'success' => true,
            'data' => $messages,
            'other_typing' => $isAdminTyping
        ]);
    }

    // POST /api/chat/send/{request_id}
    public function userSendMessage(Request $request, $requestId)
    {
        $request->validate(['message' => 'required|string']);
        $user = $request->user;

        $clientRequest = DB::table('client_requests')
            ->where('id', $requestId)
            ->where('user_id', $user->id)
            ->first();

        if (!$clientRequest) {
            return response()->json(['success' => false, 'message' => 'Unauthorized.'], 403);
        }

        $id = DB::table('client_messages')->insertGetId([
            'request_id' => $requestId,
            'sender_type' => 'user',
            'sender_id' => $user->id,
            'message' => $request->message,
            'created_at' => now(),
        ]);

        // Send Email Notification to Admin
        try {
            $adminEmail = env('MAIL_FROM_ADDRESS') ?: 'admin@codeaxe.co.in';
            Mail::to($adminEmail)->send(new NewChatMessageMailable(
                $request->message,
                $user->username,
                $clientRequest->title,
                true
            ));
        } catch (\Exception $e) {
            Log::error("Failed to send admin notification email: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'data' => DB::table('client_messages')->where('id', $id)->first()
        ]);
    }

    // POST /api/chat/typing/{request_id}
    public function userSetTyping(Request $request, $requestId)
    {
        $isTyping = $request->input('is_typing', false);
        $key = "typing_{$requestId}_user";
        if ($isTyping) {
            Cache::put($key, true, now()->addSeconds(6));
        } else {
            Cache::forget($key);
        }
        return response()->json(['success' => true]);
    }

    // ─── ADMIN METHODS ──────────────────────────────────────────────

    // GET /api/admin/chat/messages/{request_id}
    public function getAdminMessages(Request $request, $requestId)
    {
        // $request->admin attached by middleware
        $messages = DB::table('client_messages')
            ->where('request_id', $requestId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark user messages as read
        DB::table('client_messages')
            ->where('request_id', $requestId)
            ->where('sender_type', 'user')
            ->update(['is_read' => 1]);

        $isUserTyping = \Illuminate\Support\Facades\Cache::has("typing_{$requestId}_user");

        return response()->json([
            'success' => true,
            'data' => $messages,
            'other_typing' => $isUserTyping
        ]);
    }

    // POST /api/admin/chat/send/{request_id}
    public function adminSendMessage(Request $request, $requestId)
    {
        $request->validate(['message' => 'required|string']);
        $admin = $request->admin;

        // Get user details for this request
        $clientRequest = DB::table('client_requests')
            ->join('users', 'client_requests.user_id', '=', 'users.id')
            ->where('client_requests.id', $requestId)
            ->select('client_requests.*', 'users.email', 'users.username')
            ->first();

        if (!$clientRequest) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        $id = DB::table('client_messages')->insertGetId([
            'request_id' => $requestId,
            'sender_type' => 'admin',
            'sender_id' => $admin->id,
            'message' => $request->message,
            'created_at' => now(),
        ]);

        // Send Email Notification to User
        try {
            Mail::to($clientRequest->email)->send(new NewChatMessageMailable(
                $request->message,
                "Admin (" . $admin->username . ")",
                $clientRequest->title,
                false
            ));
        } catch (\Exception $e) {
            Log::error("Failed to send user notification email: " . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'data' => DB::table('client_messages')->where('id', $id)->first()
        ]);
    }

    // POST /api/admin/chat/typing/{request_id}
    public function adminSetTyping(Request $request, $requestId)
    {
        $isTyping = $request->input('is_typing', false);
        $key = "typing_{$requestId}_admin";
        if ($isTyping) {
            \Illuminate\Support\Facades\Cache::put($key, true, now()->addSeconds(6));
        } else {
            \Illuminate\Support\Facades\Cache::forget($key);
        }
        return response()->json(['success' => true]);
    }

    // GET /api/admin/chat/overview
    public function getChatOverview(Request $request)
    {
        $chats = DB::table('client_requests')
            ->join('users', 'client_requests.user_id', '=', 'users.id')
            ->select('client_requests.id', 'client_requests.title as request_title', 'client_requests.status', 'users.username', 'users.email')
            ->get();

        foreach($chats as $chat) {
            $latest = DB::table('client_messages')
                ->where('request_id', $chat->id)
                ->orderBy('created_at', 'desc')
                ->first();

            $chat->latest_message = $latest;

            $chat->unread_count = DB::table('client_messages')
                ->where('request_id', $chat->id)
                ->where('sender_type', 'user')
                ->where('is_read', 0)
                ->count();
        }

        // Filter: only show projects that have at least one message
        $chats = $chats->filter(fn($c) => !is_null($c->latest_message))
                       ->sortByDesc(fn($c) => $c->latest_message->created_at)
                       ->values();

        return response()->json(['success' => true, 'data' => $chats]);
    }

    // DELETE /api/admin/chat/clear/{request_id}
    public function clearChat(Request $request, $requestId)
    {
        DB::table('client_messages')->where('request_id', $requestId)->delete();
        return response()->json(['success' => true, 'message' => 'Chat history cleared.']);
    }

    // POST /api/admin/chat/status/{request_id}
    public function updateRequestStatus(Request $request, $requestId)
    {
        $request->validate(['status' => 'required|string']);

        DB::table('client_requests')
            ->where('id', $requestId)
            ->update(['status' => $request->status, 'updated_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Request status updated to ' . $request->status]);
    }
}
