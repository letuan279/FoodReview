<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::where('username', $request->input('username'))->get();
        if(count($user)){
            return response()->json([
                'success' => 'false',
                'message' => 'Username exits',
            ]);
        }

        
        $newUser = new User;
        $newUser->nickname = $request->input('nickname');
        $newUser->username = $request->input('username');
        $newUser->password = Hash::make($request->input('password'));
        // INSERT INTO [User]([nickname], [username], [password]) VALUES ();
        $newUser->save();

        return response()->json([
            'success' => 'true',
            'message' => 'Create new user successfully',
            'user' => $newUser
        ]);
    }

    public function login(Request $request)
    {
        if(!Auth::attempt($request->only('username', 'password')))
        {
            return response()->json([
                'success' => 'false',
                'message' => 'Incorrect email or password'
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken;
        return response()->json([
            'success' => 'true',
            'message' => 'Login successfully',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => 'true',
            'message' => 'Logout successfully',
        ]);
    }

    public function getCurrentUser(Request $request)
    {
        return response()->json([
            'success' => 'true',
            'user' => $request->user()
        ]);
    }
}
