FROM invest/sshjdk

MAINTAINER pure
# 将本地文件夹挂载到当前容器
VOLUME /tmp

ADD asset-report-ui.jar /usr/asset-report-ui.jar
RUN bash -c 'touch /app.jar'

EXPOSE 7030

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/usr/asset-report-ui.jar"]


 

