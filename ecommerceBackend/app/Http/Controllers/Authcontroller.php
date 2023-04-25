<?php

namespace App\Http\Controllers;

use App\Models\categorie;
use App\Mail\DemoMail;

use App\Models\product;
use App\Models\User;
use Auth;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Mail;
use Illuminate\Auth\Events\Registered;


class Authcontroller extends Controller
{
   
    function updateuser(){
        return response()->json([
            'status' => 200,
            'user' => Auth::user(),
        ]);
    }
    function checkmailexist(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'validationerrors' => $validator->messages()
            ]);
        }
        $userexist = User::where('email', $request->email)->first();
        if ($userexist) {
            return response()->json([
                'status' => 200,
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "user does not exist in our record"
            ]);
        }
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'name' => 'required|min:3',
            'userName' => 'required|email|unique:users,email',
            'password' => 'required|min:6|same:confirmPassword',
            'confirmPassword' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->userName,
            'password' => Hash::make($request->password)
        ]);


        if (Mail::to($request->userName)->send(new DemoMail($request->name))) {
            if (event(new Registered($user))) {
                return response()->json([
                    'status' => 200,
                    // 'token' => $token,
                    'msg' => 'Account Created successfully.Please login to continue'
                ]);
            }
        }
        return response()->json([
            'status' => 400,
            // 'user' => $user->name,
            // 'token' => $token,
            'msg' => ' Something Went Wrong.Please try again'
        ]);
        // $token = $user->createToken($user->userName . '_token')->plainTextToken;

    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'userName' => 'required|email',
            'password' => 'required|min:6',

        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }
        if (Auth::attempt(['email' => $request->userName, 'password' => $request->password])) {
            return response()->json([
                'status' => 200,
                'user' => Auth::user(),
                // 'token' => $token,
                'msg' => 'Registered successfully'
            ]);
        }


        // $user= User::where('email', $request->userName)->first();
        // // print_r($data);
        //     if (!$user || !Hash::check($request->password, $user->password)) {
        //         return response()->json([ 'msg' => 'These credentials do not match our records.',
        //         'status'=>404
        //     ]);
        //     }

        //      $token = $user->createToken($user->userName . '_token')->plainTextToken;


        return response()->json([
            'status' => 400,
            'msg' => 'Username and Password do not match'
        ]);
    }


    function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'status' => 200,
            // 'token' => $token,
            'msg' => 'Logout successfully'
        ]);
    }


    function addcategory(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [

            'name' => 'required',
            'slug' => 'required',
            'meta_title' => 'required',
            'status' => 'required'

        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }


        $product = new categorie;
        $product->meta_title = $request->meta_title;
        $product->slug = $request->slug;
        $product->name = $request->name;
        $product->status = $request->status;
        $product->description = $request->meta_title;
        $product->meta_description = $request->meta_description;
        $product->meta_keyword = $request->meta_keyword;
        if ($product->save()) {
            return response()->json([
                'status' => 200,
                'msg' => "category added succesfully"
            ]);
        }
        return response()->json([
            'status' => 400,
            'msg' => "something went wrong.Try again later"
        ]);

    }

    function viewcategory()
    {

        $category = categorie::all();
        return response()->json([
            'status' => 200,
            'allCategory' => $category
        ]);
    }

    function editcategory($id)
    {
        $getcategory = categorie::find($id);
        if ($getcategory) {
            return response()->json([
                'status' => 200,
                'getCategory' => $getcategory
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "category with id:" . $id . " does not exist"
            ]);
        }

    }


    function updatecategory(Request $request, $id)
    {
        $validator = Validator::make($request->json()->all(), [

            'name' => 'required',
            'slug' => 'required',
            'meta_title' => 'required',
            'status' => 'required'

        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }
        $getcategory = categorie::find($id);
        if ($getcategory) {
            $getcategory->meta_title = $request->meta_title;
            $getcategory->slug = $request->slug;
            $getcategory->name = $request->name;
            $getcategory->status = $request->status;
            $getcategory->description = $request->meta_title;
            $getcategory->meta_description = $request->meta_description;
            $getcategory->meta_keyword = $request->meta_keyword;
            if ($getcategory->save()) {
                return response()->json([
                    'status' => 200,
                    'msg' => "category Updated succesfully"
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => "something went succesfully"
                ]);
            }
        }
        return response()->json([
            'status' => 400,
            'msg' => "category with " . $id . " not found."
        ]);


    }

    function deletecategory($id)
    {
        $deletecategory = categorie::find($id);
        if ($deletecategory) {
            if ($deletecategory->delete()) {
                return response()->json([
                    'status' => 200,
                    'msg' => "category deleted succesfully"
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => "something went wrong"
                ]);
            }
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "category with " . $id . " not found."
            ]);
        }
    }

    function activecategory()
    {
        $allactivecategory = categorie::where('status', 0)->get();
        if ($allactivecategory) {
            return response()->json([
                'status' => 200,
                'activecategorie' => $allactivecategory
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'you need to add an categorie'
            ]);
        }
    }
    function addproduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'slug' => 'required',
            'meta_title' => 'required',
            'status' => 'required',
            'featured' => 'required',
            'popular' => 'required',
            'image' => 'required|max:2056|image',
            'category_id' => 'required'

        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        } else {
            $product = new product;
            $product->category_id = $request->category_id;
            $product->slug = $request->slug;
            $product->name = $request->name;
            $product->original_price = $request->original_price;
            $product->selling_price = $request->selling_price;
            $product->description = $request->description;
            $product->quantity = $request->quantity;

            $product->meta_title = $request->meta_title;
            $product->meta_description = $request->meta_description;
            $product->meta_keyword = $request->meta_keyword;

            $product->popular = $request->popular;
            $product->featured = $request->featured;
            $product->status = $request->status;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $ext = $file->getClientOriginalExtension();
                $filename = time() . "." . $ext;
                $file->move('uploads/image/', $filename);
                $product->image = 'uploads/image/' . $filename;
            }

            if ($product->save()) {
                return response()->json([
                    'status' => 200,
                    'msg' => 'Product added successfully'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'Product  not added successfully'
                ]);
            }


        }

    }

    function viewproduct()
    {
        $product = product::all();
        if ($product) {
            return response()->json([
                'status' => 200,
                'allproducts' => $product

            ]);
        }
    }

    function editproduct($id)
    {
        $getproduct = product::find($id);
        if ($getproduct) {
            return response()->json([
                'status' => 200,
                'getProduct' => $getproduct
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "product with id:" . $id . " does not exist"
            ]);
        }
    }
    function updateproduct(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'slug' => 'required',
            'meta_title' => 'required',
            'status' => 'required',
            'featured' => 'required',
            'popular' => 'required',
            'image' => 'max:2056',
            'category_id' => 'required'

        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        } else {
            $product = product::find($id);
            $product->category_id = $request->category_id;
            $product->slug = $request->slug;
            $product->name = $request->name;
            $product->original_price = $request->original_price;
            $product->selling_price = $request->selling_price;
            $product->description = $request->description;

            $product->meta_title = $request->meta_title;
            $product->meta_description = $request->meta_description;
            $product->meta_keyword = $request->meta_keyword;

            $product->popular = $request->popular;
            $product->featured = $request->featured;
            $product->status = $request->status;

            if ($request->hasFile('image')) {
                $path = $product->image;
                if (File::exists($path)) {
                    File::delete($path);
                }
                $file = $request->file('image');
                $ext = $file->getClientOriginalExtension();
                $filename = time() . "." . $ext;
                $file->move('uploads/image/', $filename);
                $product->image = 'uploads/image/' . $filename;
            }

            if ($product->save()) {
                return response()->json([
                    'status' => 200,
                    'msg' => 'Product Updated successfully'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'Product  not Updated successfully'
                ]);
            }


        }

    }
    function deleteproduct($id)
    {
        $deleteproduct = product::find($id);
        if ($deleteproduct) {
            $deleteproduct->status = 0;
            if ($deleteproduct->save()) {
                return response()->json([
                    'status' => 200,
                    'msg' => "product deleted succesfully"
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => "something went wrong"
                ]);
            }
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "product with " . $id . " not found."
            ]);
        }
    }
}