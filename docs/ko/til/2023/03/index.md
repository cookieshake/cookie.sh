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

## 30

- MongoDB ReplicaSet을 구성했을 때, 특정 Secondary가 Primary와의 sync가 너무 지연되면 나는 너무 stale해.. 라면서 recovering 상태에 빠지는 경우가 있다. 그 기준은 좀 더 알아봐야... 이 경우 가장 쉬운 해결책은 문제가 생긴 노드의 mongodb data 폴더를 전부 날려버리고 재시작 하는 것. Primary로 부터 처음부터 데이터를 받아와서 Sync가 진행된다.
- Spark App을 만들 때 내가 사용하는 라이브러리의 Dependency와 Spark 자체의 Dependency 간의 버전이 맞지 않아, 실제 앱을 구동했을 때 "나는 이런 메소드 알지 못해" 같은 에러가 발생할 수 있다. (특히 직접 spark를 튜닝 & 빌드해서 사용한다면 더더욱).. 그러면 [이 링크](https://engineering.statefarm.com/blog/spark-dep-conflicts)에 등장하는 해결방법을 사용해봄직 하다. `userClassPathFirst` 옵션으로 해결되지 않았으므로, shadowJar의 relocate 기능을 이용해 해결.
- Spring Boot 앱은 보통 spring gradle plugin의 bootJar 명령어를 이용해서 fatJar를 빌드하는데, 이 명령어에 Spring에 특화된 여러 과정들이 존재하는 듯 하다. 따라서 shadowJar를 이용해서 Spring Boot 어플리케이션의 구동가능한 fatJar를 만드려면 여러가지 옵션 추가가 필요하다.