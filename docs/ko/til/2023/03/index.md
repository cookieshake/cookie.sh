---
title: "2023/03"
sidebar_label: "03"
---

## 03

- spring gradle 플러그인에서 bootJar task를 이용해 jar를 빌드 할 경우, main class를 직접 선택해서 실행할 수 없다.
- spring 프로젝트를 gradle shadowJar 플러그인을 이용해 빌드할 경우, resources에서 application.yml에서 프로퍼티를 읽어올 수 없다.

## 17

- Kotlin flow 사용이 동시 처리를 보장하지는 않는다.
- Lettuce에서 코드 상 Sync/Aync API 사용과 무관하게, config를 통해 Auto Flush가 활성화된 상태라면 command 1건당 1건의 TCP 요청이 발생한다.

## 24

- Airflow DAG에서 cron으로 설정된 스케줄을 뒤로 미룰 경우, 같은 스케줄에 대해 2번 작업이 실행될 수 있다. (15 * * * *)을 (20 * * * *)으로 변경한다던가.. 알고있던 거지만 앞으로도 주의하자.

## 26

- s3(seaweedfs) + iceberg + hive metastore 사용 중 전원이 갑자기 끊기면, s3에는 metadata 업로드가 실패했지만 hive metastore에는 업데이트된 metadata path가 기록될 수 있다. 이 경우 hive metastore가 바라보는 DB를 직접 수정하여 해결 가능하다.  
[해결 방법 링크](/ko/wiki/problems-and-solutions/hive-metastore-iceberg-metadata-error)