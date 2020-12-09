<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $get_all = User::paginate(10);
        return response()->json([
            'user' => $get_all
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = User::where('username', $request->username )->orWhere('phone_number', $request->phone_number)->first();
        if($user) {
            return response()->json([
                "message" => "Username or Phone number already exists, please choose another"
            ], 400);
        }
        $new_user = User::create([
            "email" => Hash::make(rand(10,20)) . "@" . "yahoo.com",
            "name" => Hash::make(rand(10,20)),
            "username" => $request->username,
            "phone_number" => $request->phone_number,
            "password" => Hash::make(rand(10,20))
        ]);
        $new_user->save();
        return response()->json([
            'user' =>  $new_user
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $user->username = $request->username;
        $user->phone_number = $request->phone_number;
        $user->save();
        return response()->json([
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if(!$user) {
            return response()->json([
                'message' => "User not found"
            ], 400);
        }
        $user->delete();
        return response()->json([
            'message' => 'User has been deleted',
            'user' => $id
        ]);
    }
}
