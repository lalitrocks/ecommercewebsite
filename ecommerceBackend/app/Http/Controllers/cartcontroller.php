<?php

namespace App\Http\Controllers;

use App\Mail\DemoMail;
use App\Mail\productsuccess;
use App\Models\cart;
use App\Models\order;
use App\Models\orderitem;
use App\Models\product;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Mail;
use Illuminate\Support\Facades\Hash;


class cartcontroller extends Controller
{
    function confirmpassword(Request $request){
        $validator = Validator::make($request->json()->all(), [
            'confirmpasswordbeforepayment' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }else{
            if (Hash::check($request->confirmpasswordbeforepayment, Auth::user()->password)) {
                return response()->json([
                    'status' => 200,
                    'msg' => 'password matched'
                ]);
            }else{
                return response()->json([
                    'status' => 400,
                    'msg' => 'password not matched'
                ]);
            }

        }
    }
    function addtocarttable($quantity, $product_id)
    {
        $product = product::where('id', $product_id)->first();

        if ($product) {
            $isproductalreadyaddedtocart = cart::where('user_id', Auth::user()->id)->where('product_id', $product_id)->get();

            if (count($isproductalreadyaddedtocart) < 1) {
                $cart = new cart;
                $cart->user_id = Auth::user()->id;
                $cart->quantity = $quantity;
                $cart->product_id = $product_id;
                $cart->save();
                return response()->json([
                    'status' => 200,
                    'msg' => 'product added to cart'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'product is already added to cart'
                ]);
            }


        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'product  with id ' . $product_id . ' not found'
            ]);
        }
    }

    function getcartdetail()
    {
        $cartitem = DB::select('SELECT products.id as product_id,products.quantity as product_quantity,products.selling_price,cart.id,cart.quantity,products.name,products.image FROM cart JOIN products ON cart.product_id = products.id  WHERE user_id =' . Auth::user()->id);
        if ($cartitem) {
            return response()->json([
                'status' => 200,
                'item' => $cartitem
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'no item present in cart'
            ]);
        }

    }
    function incdec($cart_id, $method)
    {
        $cartitem = cart::find($cart_id);

        if ($method === 'inc') {
            $cartitem->quantity = $cartitem->quantity + 1;
            $cartitem->save();
        } else if ($method === 'dec') {
            $cartitem->quantity = $cartitem->quantity - 1;
            $cartitem->save();

        }
    }

    function deletecartitem($cart_id)
    {
        $cartitem = cart::find($cart_id);
        if ($cartitem->delete()) {
            return response()->json([
                'status' => 200,
                'msg' => ' item is deleted'
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'item not deleted something went wrong.'
            ]);
        }

    }


    function makepayment(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'first_name' => 'required|min:3',
            'email' => 'required|email',
            'phone_number' => 'required|min:10|max:10',
            'city' => 'required',
            'state' => 'required',
            'pincode' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        }
        $data = $request->json()->all();


        $order_id = DB::select("SELECT  `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '".env('DB_DATABASE')."' AND TABLE_NAME = 'order' ");
        $mainorder_id = $order_id[0]->AUTO_INCREMENT;
        $order = new order;
        $order->user_id = Auth::user()->id;
        $order->first_name = $data['first_name'];
        $order->last_name = $data['last_name'];
        $order->phone_number = $data['phone_number'];
        $order->email = $data['email'];
        $order->address = $data['full_address'];
        $order->city = $data['city'];
        $order->state = $data['state'];
        $order->pincode = $data['pincode'];
        $order->payment_id = $data['payment_id'];
        $order->payment_mode = $data['payment_mode'];
        $order->stripe_payment_status = $data['stripe_payment_status'];

        $order->tracking_no = 'lalitwebsite' . rand(1000000, 9999999999);
        // $order->remark = $request->last_name;
        // $order->status = $request->last_name;

        if ($order->save()) {
            $cartitem = cart::where('user_id', Auth::user()->id)->get();
            $ordeeritems = [];
            foreach ($cartitem as $key) {
                $ordeeritems[] = [
                    "qty" => $key->quantity,
                    "price" => product::find($key->product_id)->selling_price,
                    'product_id' => $key->product_id,
                    'order_id' => $mainorder_id
                ];
            }
            foreach ($ordeeritems as $item) {
                $insertorderitem = new orderitem;
                $insertorderitem->order_id = $item['order_id'];
                $insertorderitem->product_id = $item['product_id'];
                $insertorderitem->price = $item['price'];
                $insertorderitem->qty = $item['qty'];
                if ($insertorderitem->save()) {
                    $currentproduct = product::find($item['product_id']);
                    $currentproduct->quantity = $currentproduct->quantity - $item['qty'];
                    $currentproduct->save();
                } else {
                    return response()->json([
                        'status' => 400,
                        'msg' => 'orderitems is  not saved'
                    ]);
                }
            }

            if (cart::where('user_id', Auth::user()->id)->delete()) {
                return response()->json([
                    'status' => 200,
                    'order_id' => $mainorder_id,
                    'msg' => 'order placed succesfully'
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => 'cart is not empty.'
                ]);
            }
        } else {
            return response()->json([
                'status' => 400,
                'msg' => 'form details not entered in order'
            ]);
        }
    }

    function validateform(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'first_name' => 'required|min:3',
            'email' => 'required|email',
            'phone_number' => 'required|min:10|max:10',
            'city' => 'required',
            'state' => 'required',
            'pincode' => 'required',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        } else {
            return response()->json([
                'status' => 200,
            ]);
        }

    }

    function stripe($amount)
    {
        $stripe = new \Stripe\StripeClient(
            'sk_test_51MpcCGSAt07Q9pdPSC38SKRQKK73vMOrvcKsQyCXUbXXFdi35PmHbswkjmqz8h2fLJ0ByCFRZ7vM4MjKcnWN9Toc005G8FJAXe'
        );
        $intent = $stripe->paymentIntents->create([
            'amount' => $amount,
            'currency' => 'inr',
            'payment_method_types' => ['card'],
            // 'automatic_payment_methods' => [
            //   'enabled' => true,
            // ],
        ]);
        // $stripe->webhookEndpoints->create([
        //     'url' => 'https://example.com/my/webhook/endpoint',
        //     'enabled_events' => [
        //         'charge.failed',
        //         'charge.succeeded',
        //     ],
        // ]);

        return response()->json([
            'status' => 200,
            'client_secret' => $intent->client_secret
        ]);
    }
    function saverazorpaymentdetails(Request $request)
    {
        $validator = Validator::make($request->json()->all(), [
            'order_id' => 'required',
            'payment_intent' => 'required',
            'payment_intent_client_secret' => 'required'

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 404,
                'Validationerrors' => $validator->messages()
            ]);
        } else {
            $currentorder = order::find($request->order_id);
            $currentorder->payment_intent = $request->payment_intent;
            $currentorder->payment_intent_client_secret = $request->payment_intent_client_secret;
            $currentorder->stripe_payment_status = $request->redirect_status;
            $currentorder->save();

            $allordereditems = orderitem::where('order_id', $request->order_id)->get();
            foreach ($allordereditems as $item) {
                $product = product::find($item->product_id);
                Mail::to(Auth::user()->email)->send(new productsuccess($product->name, $item->qty));
            }


            return response()->json([
                'status' => 200,
                'msg' => "payment is succesful"
            ]);

        }
    }
    function restockafterstripefailure(Request $request)
    {
        $updateorder = order::find($request->order_id);
        $updateorder->stripe_payment_status = "failed";
        if ($updateorder->save()) {
            $updateproduct = product::find($request->product_id);
            $updateproduct->quantity = $updateproduct->quantity + $request->quantity;
            if ($updateproduct->save()) {
                $restockcart = new cart;
                $restockcart->user_id = Auth::user()->id;
                $restockcart->quantity = $request->quantity;
                $restockcart->product_id = $request->product_id;
                $restockcart->save();
            } else {
                return response()->json([
                    'status' => 400,
                    'msg' => "product quantity is not updated"
                ]);
            }
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "order status is not updated"
            ]);
        }
    }

    function getallorder()
    {
        $allorder = order::where('user_id', Auth::user()->id)->get();
        $orderid = [];
        foreach ($allorder as $key) {
            $orderid[] = $key->id;
        }
        $orderitems = [];
        foreach ($orderid as $id) {
            // $orderitem = orderitem::where('order_id', $id)->get();
            $orderitem = DB::select('SELECT orderitems.price,orderitems.qty,products.image,products.name FROM `orderitems` JOIN products ON orderitems.product_id = products.id  WHERE order_id ='.$id);
            foreach ($orderitem as $key) {
                array_push($orderitems,$key);
            }
            
        }
        if ($orderitems) {
            return response()->json([
                'status' => 200,
                'orderitems' => $orderitems
            ]);
        } else {
            return response()->json([
                'status' => 400,
                'msg' => "you have no order"
            ]);
        }
    }
}