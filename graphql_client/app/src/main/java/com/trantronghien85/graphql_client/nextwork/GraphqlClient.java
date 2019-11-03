package com.trantronghien85.graphql_client.nextwork;

import com.apollographql.apollo.ApolloClient;
import com.trantronghien85.graphql_client.BuildConfig;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;

public final class GraphqlClient {
    public static String AUTH_TOKEN = "";
    public static final String BASE_URL = "https://mighty-tor-63635.herokuapp.com/graphql";

    private static OkHttpClient okHttp;
    public static ApolloClient setupApollo(boolean resest) {
        if (resest || okHttp == null){
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.level(HttpLoggingInterceptor.Level.HEADERS);
            logging.level(HttpLoggingInterceptor.Level.BODY);
            okHttp = new OkHttpClient
                    .Builder()
                    .addInterceptor(logging)
                    .addInterceptor(new Interceptor() {
                        @NotNull
                        @Override
                        public Response intercept(@NotNull Chain chain) throws IOException {
                            Request original = chain.request();
                            Request.Builder builder = original.newBuilder().method(original.method(),
                                    original.body());
                            builder.addHeader("Authorization"
                                    , "Bearer " + AUTH_TOKEN);
                            return chain.proceed(builder.build());
                        }
                    })
                    .build();
        }

        return ApolloClient.builder()
                .serverUrl(BASE_URL)
                .okHttpClient(okHttp)
                .build();
    }
}
