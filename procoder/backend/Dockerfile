# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /App

# 复制项目文件并还原依赖
COPY *.csproj ./
RUN dotnet restore

# 复制所有源代码并发布
COPY . ./
RUN dotnet publish -c Release -o out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /App
COPY --from=build /App/out .

# 启动应用程序
ENTRYPOINT ["dotnet", "ProCoder.dll"]