package com.trantronghien85.graphql_client

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val token = intent.getStringExtra("token")
        val userId = intent.getStringExtra("userId")
        val tokenExpiration = intent.getStringExtra("tokenExpiration")
        result_login.text = token + "\n" + userId + "\n"  + tokenExpiration
    }
}
