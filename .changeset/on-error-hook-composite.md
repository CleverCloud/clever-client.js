---
'@clevercloud/client': patch
---

Call the `onError` hook once per failed `send()`, and never for an error a composite command recovers from

A composite command used to report an inner error twice. It also reported the errors it tolerates itself, such as the 404 `ListDomainCommand` gets for an application without a primary domain, or the 404 responses polled while waiting for a network group or a Kubernetes cluster.
