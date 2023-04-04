---
title: "Hive Metastore에서 SSL Handshake에 실패하여 S3연결에 실패할 경우"
keywords: [s3, hive-metastore, ssl, handshake]
tags: [s3, hive-metastore, ssl, handshake]
last_update:
    date: 2023-04-04
    author: cookieshake
---

## 문제

새로운 테이블 생성 등 DDL 관련 작업이 Hive Metastore관련 에러로 실패한다. 

## 증상

Hive Metastore 로그에서, 아래와 같이 SSL Handshake 문제로 인해 S3(혹은 호환 스토리지)와의 통신이 실패했음을 확인할 수 있다.

``` bash
2023-04-01T15:23:17,967 DEBUG [pool-6-thread-16] ssl.SSLConnectionSocketFactory: Connecting socket to s3.seaweedfs.mdc.ingtra.net/100.103.17.64:443 with timeout 5000
2023-04-01T15:23:17,969 DEBUG [pool-6-thread-16] ssl.SSLConnectionSocketFactory: Enabled protocols: [TLSv1.2]
2023-04-01T15:23:17,969 DEBUG [pool-6-thread-16] ssl.SSLConnectionSocketFactory: Enabled cipher suites:[TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_DHE_RSA_WITH_AES_256_CBC_SHA256, TLS_DHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_DHE_RSA_WITH_AES_256_CBC_SHA, TLS_DHE_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_256_CBC_SHA256, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_EMPTY_RENEGOTIATION_INFO_SCSV]
2023-04-01T15:23:17,969 DEBUG [pool-6-thread-16] ssl.SSLConnectionSocketFactory: Starting handshake
2023-04-01T15:23:17,971 DEBUG [pool-6-thread-16] conn.ClientConnectionManagerFactory: 
java.lang.reflect.InvocationTargetException: null
        at sun.reflect.GeneratedMethodAccessor17.invoke(Unknown Source) ~[?:?]
        at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43) ~[?:1.8.0_332]
        at java.lang.reflect.Method.invoke(Method.java:498) ~[?:1.8.0_332]
..........
2023-04-01T15:23:17,973 ERROR [pool-6-thread-16] utils.MetaStoreUtils: Got exception: org.apache.hadoop.fs.s3a.AWSClientIOException getFileStatus on s3a://iceberg/twitter.db/korean_tweets-96dd833f46e2472cb61d83a42f59bbe3: com.amazonaws.SdkClientException: Unable to execute HTTP request: Received fatal alert: handshake_failure: Unable to execute HTTP request: Received fatal alert: handshake_failure
org.apache.hadoop.fs.s3a.AWSClientIOException: getFileStatus on s3a://iceberg/twitter.db/korean_tweets-96dd833f46e2472cb61d83a42f59bbe3: com.amazonaws.SdkClientException: Unable to execute HTTP request: Received fatal alert: handshake_failure: Unable to execute HTTP request: Received fatal alert: handshake_failure
        at org.apache.hadoop.fs.s3a.S3AUtils.translateException(S3AUtils.java:214) ~[hadoop-aws-3.3.2.jar:?]
        at org.apache.hadoop.fs.s3a.S3AUtils.translateException(S3AUtils.java:175) ~[hadoop-aws-3.3.2.jar:?]
        at org.apache.hadoop.fs.s3a.S3AFileSystem.s3GetFileStatus(S3AFileSystem.java:3799) ~[hadoop-aws-3.3.2.jar:?]
        at org.apache.hadoop.fs.s3a.S3AFileSystem.innerGetFileStatus(S3AFileSystem.java:3688) ~[hadoop-aws-3.3.2.jar:?]
```

## 원인

JVM에 오브젝트 스토리지가 사용 중인 인증서의 Root CA가 등록되어 있지 않기 때문.

## 해결방안

Root CA가 담긴 Keystore를 사용하거나, JVM을 업데이트 한다.

JVM 1.8을 11로 업그레이드하여 해결함.