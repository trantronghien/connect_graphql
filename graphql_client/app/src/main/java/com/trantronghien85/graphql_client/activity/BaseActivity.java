package com.trantronghien85.graphql_client.activity;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.apollographql.apollo.ApolloClient;
import com.trantronghien85.graphql_client.nextwork.GraphqlClient;

public class BaseActivity extends AppCompatActivity {

    protected ApolloClient client;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        client = GraphqlClient.setupApollo(false);
    }
}
