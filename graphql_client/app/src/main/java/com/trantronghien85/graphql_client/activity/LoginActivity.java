package com.trantronghien85.graphql_client.activity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.StringRes;
import androidx.appcompat.app.AppCompatActivity;

import com.apollographql.apollo.ApolloCall;
import com.apollographql.apollo.ApolloClient;
import com.apollographql.apollo.api.Response;
import com.apollographql.apollo.exception.ApolloException;
import com.apollographql.apollo.fetcher.ApolloResponseFetchers;
import com.apollographql.apollo.rx2.Rx2Apollo;
import com.trantronghien85.graphql_client.MainActivity;
import com.trantronghien85.graphql_client.R;
import com.trantronghien85.graphql_client.graphql.LoginResultMutation;
import com.trantronghien85.graphql_client.nextwork.GraphqlClient;

import org.jetbrains.annotations.NotNull;

import io.reactivex.Observable;
import io.reactivex.Observer;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Action;
import io.reactivex.functions.Consumer;
import io.reactivex.schedulers.Schedulers;

public class LoginActivity extends AppCompatActivity {
    private ApolloClient client;
    private ProgressBar loadingProgressBar;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        client = GraphqlClient.setupApollo();
        final EditText usernameEditText = findViewById(R.id.username);
        final EditText passwordEditText = findViewById(R.id.password);
        final Button loginButton = findViewById(R.id.login);
        loadingProgressBar = findViewById(R.id.loading);

        loginButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                doLogin(usernameEditText.getText().toString(),
                        passwordEditText.getText().toString());
            }
        });
    }

    private void doLogin(String userName, String password) {
        LoginResultMutation loginResultMutation = LoginResultMutation.builder().email(userName).password(password).build();
//        client.mutate(loginResultMutation).enqueue(new ApolloCall.Callback<LoginResultMutation.Data>() {
//            @Override
//            public void onResponse(@NotNull Response<LoginResultMutation.Data> response) {
//
//            }
//
//            @Override
//            public void onFailure(@NotNull ApolloException e) {
//
//            }
//        });
        ApolloCall<LoginResultMutation.Data> loginCall = client
                .mutate(new LoginResultMutation(userName , password));

        Observable<Response<LoginResultMutation.Data>> observable = Rx2Apollo.from(loginCall);
        observable.observeOn(AndroidSchedulers.mainThread())
                .subscribeOn(Schedulers.io()).subscribe(new Observer<Response<LoginResultMutation.Data>>() {
            @Override
            public void onSubscribe(Disposable d) {
                loadingProgressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onNext(Response<LoginResultMutation.Data> dataResponse) {
                if (dataResponse.hasErrors()){
                    Toast.makeText(LoginActivity.this, dataResponse.errors().get(0).message(), Toast.LENGTH_SHORT).show();
                }else {
                    if (dataResponse.data() != null){
                        String token = dataResponse.data().login().token();
                        String userId = dataResponse.data().login().userId();
                        String tokenExpiration = dataResponse.data().login().tokenExpiration();
                        Toast.makeText(LoginActivity.this, token, Toast.LENGTH_SHORT).show();
                        gotoMain(token , userId , tokenExpiration);
                    }

                }
            }

            @Override
            public void onError(Throwable e) {
                Toast.makeText(LoginActivity.this, "onError: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                onComplete();
            }

            @Override
            public void onComplete() {
                Toast.makeText(LoginActivity.this, "onComplete", Toast.LENGTH_SHORT).show();
                loadingProgressBar.setVisibility(View.GONE);
            }
        });
    }

    private void gotoMain(String token, String userId, String tokenExpiration) {
        Intent intent = new Intent(LoginActivity.this , MainActivity.class);
        intent.putExtra("token" , token);
        intent.putExtra("userId" , userId);
        intent.putExtra("tokenExpiration" , tokenExpiration);
        this.startActivity(intent);
    }

//    private void updateUiWithUser(LoggedInUserView model) {
//        String welcome = getString(R.string.welcome) + model.getDisplayName();
//        // TODO : initiate successful logged in experience
//        Toast.makeText(getApplicationContext(), welcome, Toast.LENGTH_LONG).show();
//    }

    private void showLoginFailed(@StringRes Integer errorString) {
        Toast.makeText(getApplicationContext(), errorString, Toast.LENGTH_SHORT).show();
    }
}
