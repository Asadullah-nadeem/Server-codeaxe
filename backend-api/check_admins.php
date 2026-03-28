<?php
use Illuminate\Support\Facades\DB;
foreach(DB::table('admins')->get() as $a) {
    echo "id: {$a->id}, user: {$a->username}, role: {$a->role}\n";
}
