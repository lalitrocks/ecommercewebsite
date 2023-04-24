<?php

use App\Http\Controllers\Authcontroller;
use App\Http\Controllers\ProfileController;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});





// Route::get('/email/verify', function () {
//     return view('auth.verify-email');
// })->middleware('auth')->name('verification.notice');


Route::get('/verify-email/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
 
    return redirect()->away('http://localhost:3000/login');
})->middleware(['auth', 'signed'])->name('verification.verify');

 
Route::post('/email/verification-notify', function (Request $request) {
 Auth::user()->sendEmailVerificationNotification();
    return response()->json([
        'status'=>200,
        'msg'=>'verification link sent'
    ]);
 
 
    
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

require __DIR__.'/auth.php';


Route::post('login',[Authcontroller::class,'login']);
Route::post('register',[Authcontroller::class,'register']);
Route::post('logout',[Authcontroller::class,'logout'])->middleware('auth');
Route::post('checkmailexist',[Authcontroller::class,'checkmailexist']);




// password reset
Route::get('/reset-password/{token}', function (Request $request,string $token) {
    return view('auth.reset-password', ['token' => $token,'email'=>$request->query('email')]);
})->middleware('guest')->name('password.reset');

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    // return $status === Password::PASSWORD_RESET
    //     ? redirect()->route('login')->with('status', __($status))
    //     : back()->withErrors(['email' => [__($status)]]);
    if ($status === Password::PASSWORD_RESET) {
        return redirect()->away('http://localhost:3000/login/success');
    }else{
        return redirect()->away('http://localhost:3000/login/failed');

    }
})->middleware('guest')->name('password.update');