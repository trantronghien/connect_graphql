package com.trantronghien85.graphql_client.activity

import android.app.AlertDialog
import android.os.Bundle
import android.text.TextUtils
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import com.apollographql.apollo.rx2.Rx2Apollo
import com.trantronghien85.graphql_client.R
import com.trantronghien85.graphql_client.graphql.CreatePostResultMutation
import com.trantronghien85.graphql_client.graphql.type.PostsInput
import com.trantronghien85.graphql_client.nextwork.GraphqlClient
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.schedulers.Schedulers
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : BaseActivity() {
    var postData: MutableList<PostsInput>? = null
    var matationPostBuilder: CreatePostResultMutation.Builder? = null
    private var loadingProgressBar: ProgressBar? = null
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        postData = mutableListOf()
        matationPostBuilder = CreatePostResultMutation.builder()
        val token = intent.getStringExtra("token")
        val userId = intent.getStringExtra("userId")
        val tokenExpiration = intent.getStringExtra("tokenExpiration")
        GraphqlClient.AUTH_TOKEN = token
        // set token and reset http client
        client = GraphqlClient.setupApollo(true)
//        result_login.text = token + "\n" + userId + "\n"  + tokenExpiration

        btnPost.setOnClickListener {
            val title = edtTitle.text.toString()
            val content = editContent.text.toString()
            if (TextUtils.isEmpty(title) || content.isNullOrBlank()) {
                Toast.makeText(this@MainActivity, "title or content not empty", Toast.LENGTH_SHORT)
                return@setOnClickListener
            } else {
                val post = PostsInput.builder()
                    .post_title(title)
                    .post_content(content)
                    .post_has_article(1)
                    .post_status("")
                    .post_type("1")
                    .build()
                createPost(post)
            }
        }
    }

    private fun createPost(post: PostsInput?) {
        post?.let { postData?.add(it) }
//        postData?.let { matationPostBuilder?.inputCreate(it)?.build() }

        val postCall = postData?.let { CreatePostResultMutation(it) }?.let {
            client
                .mutate<CreatePostResultMutation.Data, CreatePostResultMutation.Data, CreatePostResultMutation.Variables>(
                    it
                )
        }
        postCall?.let {
            Rx2Apollo.from(it).observeOn(AndroidSchedulers.mainThread())
                .subscribeOn(Schedulers.io())
                .subscribe(
                    { result ->
                            if (result.hasErrors()) {
                                Toast.makeText(
                                    this@MainActivity,
                                    result.errors().get(0).message(),
                                    Toast.LENGTH_SHORT
                                )
                            }else{
                                val builder = AlertDialog.Builder(this@MainActivity)
                                builder.setTitle("Thông báo")
                                builder.setMessage("Create post success title post: " + result?.data()?.createPosts()?.get(0)?.post_title())
                                builder.setPositiveButton("YES"){dialog, which ->
                                    cleanData()
                                }
                                val dialog: AlertDialog = builder.create()
                                dialog.show()

                            }
                    },
                    { error ->
                        Toast.makeText(
                            this@MainActivity,
                            error.message,
                            Toast.LENGTH_SHORT
                        )
                        loadingProgressBar?.visibility = View.GONE
                    },
                    {
                        loadingProgressBar?.visibility = View.GONE
                    },
                    {
                        loadingProgressBar?.visibility = View.VISIBLE
                    })
        }
    }

    private fun cleanData() {
        editContent.setText("")
        edtTitle.setText("")
    }
}
