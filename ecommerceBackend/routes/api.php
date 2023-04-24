<?php

use App\Http\Controllers\Authcontroller;
use App\Http\Controllers\cartcontroller;
use App\Http\Controllers\publiccontroller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/



Route::middleware(['auth', 'isadmin','isuserverified'])->group(function () {

    ///admin routes
    Route::post('admin/addcategory', [Authcontroller::class, 'addcategory']);
    Route::get('admin/viewcategory', [Authcontroller::class, 'viewcategory']);
    Route::get('admin/editcategory/{id}', [Authcontroller::class, 'editcategory']);
    Route::put('admin/updatecategory/{id}', [Authcontroller::class, 'updatecategory']);
    Route::get('admin/deletecategory/{id}', [Authcontroller::class, 'deletecategory']);
    Route::post('admin/addproduct', [Authcontroller::class, 'addproduct']);
    Route::get('admin/viewproduct', [Authcontroller::class, 'viewproduct']);
    Route::get('admin/editproduct/{id}', [Authcontroller::class, 'editproduct']);
    Route::post('admin/updateproduct/{id}', [Authcontroller::class, 'updateproduct']);
    Route::get('admin/deleteproduct/{id}', [Authcontroller::class, 'deleteproduct']);

});



Route::middleware(['auth','isuserverified'])->group(function () {


    Route::get('admin/getactivecategory', [Authcontroller::class, 'activecategory']);
    Route::get('updateuser', [Authcontroller::class, 'updateuser']);

//frontend non-admin client
    Route::get('getcategory', [publiccontroller::class, 'getcategory']);
    Route::get('viewproductbyslug/{slug}', [publiccontroller::class, 'viewproductbycatslug']);
    Route::get('viewproductdetailsbyslug/{category}/{product}', [publiccontroller::class, 'viewproductdetailbycatslug']);
    Route::post('addtocart/{quantity}/{product_id}', [cartcontroller::class, 'addtocarttable']);
    Route::get('getcartdetail', [cartcontroller::class, 'getcartdetail']);
    Route::get('incdeccart/{cart_id}/{method}', [cartcontroller::class, 'incdec']);
    Route::get('deletecartitem/{cart_id}', [cartcontroller::class, 'deletecartitem']);
    Route::post('validateform', [cartcontroller::class, 'validateform']);
    Route::post('confirmpassword', [cartcontroller::class, 'confirmpassword']);

    //stripe,razorpay,cod
    Route::get('stripe/{amount}', [cartcontroller::class, 'stripe']);
    Route::post('makepayment', [cartcontroller::class, 'makepayment']);
    Route::post('saverazorpaymentdetails', [cartcontroller::class, 'saverazorpaymentdetails']);

    Route::get('getallorder', [cartcontroller::class, 'getallorder']);

});

Route::post('restockafterstripefailure', [cartcontroller::class, 'restockafterstripefailure']);
Route::get('test', [Authcontroller::class, 'test']);

//password reset 
// Route::get('/forgot-password', function () {
//     return view('auth.forgot-password');
// })->middleware('guest')->name('password.request');


Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );


    if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
            'status' => 200,
            'msg' => $status
        ]);
    } else {
        return response()->json([
            'status' => 400,
            'msg' => "something went worng"
        ]);
    }


})->middleware('guest')->name('password.email');