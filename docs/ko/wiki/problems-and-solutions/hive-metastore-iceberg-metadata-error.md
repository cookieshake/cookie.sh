---
title: "Hive Metastore가 잘못된 Iceberg metadata를 가리킬 경우"
---

## 문제

S3(seaweedfs) + Iceberg + Hive Metastore 사용 중 전원이 갑자기 끊기면, S3에는 metadata 업로드가 실패했지만 Hive Metastore에는 업데이트된 metadata path가 기록될 수 있다.

## 증상

이 경우 아래와 같은 에러 메시지가 발생할 수 있다.

### Spark / Kyuubi의 경우

```
org.apache.kyuubi.KyuubiSQLException: org.apache.kyuubi.KyuubiSQLException: Error operating ExecuteStatement: org.apache.iceberg.exceptions.NotFoundException: Failed to open input stream for file: s3a://iceberg/twitter.db/sampled_stream/metadata/439363-8150b128-b837-4c73-860d-a7da34e88a6d.metadata.json
```

### Trino의 경우

```
org.apache.iceberg.exceptions.RuntimeIOException: Failed to read file: io.trino.plugin.iceberg.fileio.ForwardingInputFile@2a8755ee
	at org.apache.iceberg.TableMetadataParser.read(TableMetadataParser.java:276)
	at io.trino.plugin.iceberg.catalog.AbstractIcebergTableOperations.lambda$refreshFromMetadataLocation$1(AbstractIcebergTableOperations.java:224)
	at dev.failsafe.Functions.lambda$toCtxSupplier$11(Functions.java:243)
...
Caused by: io.trino.plugin.hive.s3.TrinoS3FileSystem.UnrecoverableS3OperationException: com.amazonaws.services.s3.model.AmazonS3Exception: The specified key does not exist. (Service: Amazon S3; Status Code: 404; Error Code: NoSuchKey; Request ID: 1679744171120452694; S3 Extended Request ID: null; Proxy: null), S3 Extended Request ID: null (Path: s3a://iceberg/twitter.db/sampled_stream/metadata/439363-8150b128-b837-4c73-860d-a7da34e88a6d.metadata.json)
	at io.trino.plugin.hive.s3.TrinoS3FileSystem$TrinoS3InputStream.lambda$openStream$2(TrinoS3FileSystem.java:1537)
	at io.trino.plugin.hive.util.RetryDriver.run(RetryDriver.java:130)
	at io.trino.plugin.hive.s3.TrinoS3FileSystem$TrinoS3InputStream.openStream(TrinoS3FileSystem.java:1515)
...
Caused by: com.amazonaws.services.s3.model.AmazonS3Exception: The specified key does not exist. (Service: Amazon S3; Status Code: 404; Error Code: NoSuchKey; Request ID: 1679744171120452694; S3 Extended Request ID: null; Proxy: null)
	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.handleErrorResponse(AmazonHttpClient.java:1879)
	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.handleServiceErrorResponse(AmazonHttpClient.java:1418)
	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.executeOneRequest(AmazonHttpClient.java:1387)
```

## 해결방안

이 경우 hive metastore가 바라보는 DB를 직접 수정하여 해결 가능하다. 아래는 MySQL이 backend DB일 경우의 예시이다.

``` sql
UPDATE hive_metastore.TABLE_PARAMS
SET PARAM_VALUE = 's3a://iceberg/twitter.db/sampled_stream/metadata/439362-d3e98c09-4123-4c5e-8798-bad3545fc6dc.metadata.json'
WHERE 
	TBL_ID = 56
	AND PARAM_KEY = 'metadata_location'
```