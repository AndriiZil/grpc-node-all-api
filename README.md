### About gRPC Technology
#### 4 Types of gRPC API
* Unary
* Server Streaming
* Client Streaming
* Bi Directional Streaming
```
    service GreetService {
        // Unary
        rpc Greet(GreetRequest) returns (GreetResponse) {};
        
        // Streaming Server
        rpc GreetManyTimes(GreetManyTimesReuest) returns (stream GreetManyTimesResponse) {};
        
        // Streaming Client
        rpc LongGreet(stream LongGreetRequest) returns (LongGreetResponse) {};
        
        // Bi Directional Streaming
        rpc GreatEveryone(stream GreetEveryoneRequest) returns (stream GreetEveryoneResponse) {};
    }
```
### Install grpc-tools globally
```
    npm install -g grpc-tools
```
### Code generation
```
    protoc -I=. ./protos/dummy.proto \
    --js_out=import_style=commonjs,binary:./server \
    --grpc_out=./server \
    --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
```
